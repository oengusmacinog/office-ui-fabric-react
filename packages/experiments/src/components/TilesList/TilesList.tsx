
import * as React from 'react';
import { ITilesListProps, ITilesGridItem, ITilesGridSegment, TilesGridMode, ITileSize } from './TilesList.types';
import { List, IPageProps } from 'office-ui-fabric-react/lib/List';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { autobind, css, IRenderFunction, IRectangle } from 'office-ui-fabric-react/lib/Utilities';
import * as TilesListStylesModule from './TilesList.scss';

// tslint:disable-next-line:no-any
const TilesListStyles: any = TilesListStylesModule;

const MAX_TILE_STRETCH = 1.5;
const CELLS_PER_PAGE = 100;
const MIN_ASPECT_RATIO = 0.5;
const MAX_ASPECT_RATIO = 3;

export interface ITilesListState<TItem> {
  cells: ITileCell<TItem>[];
}

export interface ITileGrid {
  minRowHeight: number;
  mode: TilesGridMode;
  spacing: number;
  maxScaleFactor: number;
  marginTop: number;
  marginBottom: number;
  key: string;
}

export interface ITileCell<TItem> {
  key: string;
  content: TItem;
  aspectRatio: number;
  grid: ITileGrid;
  onRender(content: TItem, finalSize: { width: number; height: number; }): React.ReactNode | React.ReactNode[];
}

interface IRowData {
  scaleFactor: number;
  isLastRow?: boolean;
}

interface IPageData<TItem> {
  pageWidths: {
    [index: number]: number;
  };
  rows: {
    [index: number]: IRowData;
  };
  cellSizes: {
    [index: number]: ITileSize;
  };
  extraCells: ITileCell<TItem>[] | undefined;
}

interface IPageSpecification<TItem> {
  itemCount: number;
  data: IPageData<TItem>;
}

interface IPageSpecificationCache<TItem> {
  byIndex: {
    [index: number]: IPageSpecification<TItem>;
  };
  width: number;
}

export class TilesList<TItem> extends React.Component<ITilesListProps<TItem>, ITilesListState<TItem>> {
  private _pageSpecificationCache: IPageSpecificationCache<TItem> | undefined;

  // tslint:disable-next-line:no-any
  constructor(props: ITilesListProps<TItem>, context: any) {
    super(props, context);

    this.state = {
      cells: this._getCells(props.items)
    };
  }

  public componentWillReceiveProps(nextProps: ITilesListProps<TItem>): void {
    if (nextProps.items !== this.props.items) {
      this.setState({
        cells: this._getCells(nextProps.items)
      });
    }
  }

  public componentWillUpdate(nextProps: ITilesListProps<TItem>, nextState: ITilesListState<TItem>): void {
    if (nextState.cells !== this.state.cells) {
      this._pageSpecificationCache = undefined;
    }
  }

  public render(): JSX.Element {
    const {
      cells
    } = this.state;

    const {
      className,
      onActiveElementChanged,
      items,
      cellsPerPage,
      ref,
      role,
      focusZoneComponentRef,
      ...divProps
    } = this.props;

    return (
      <FocusZone
        role={ role }
        { ...divProps }
        ref={ ref as ((element: FocusZone | null) => void) }
        componentRef={ focusZoneComponentRef }
        className={ css('ms-TilesList', className) }
        direction={ FocusZoneDirection.bidirectional }
        onActiveElementChanged={ this.props.onActiveElementChanged }
      >
        <List
          items={ cells }
          role={ role ? 'presentation' : undefined }
          getPageSpecification={ this._getPageSpecification }
          onRenderPage={ this._onRenderPage }
        />
      </FocusZone>
    );
  }

  private _onRenderCell(item: ITileCell<TItem>, finalSize: ITileSize): JSX.Element {
    if (item.grid.mode === TilesGridMode.none) {
      return (
        <div
          className={ css(TilesListStyles.header) }
        >
          { item.onRender(item.content, { width: 0, height: 0 }) }
        </div>
      );
    }

    const itemWidthOverHeight = item.aspectRatio;
    const itemHeightOverWidth = 1 / itemWidthOverHeight;

    return (
      <div
        role='presentation'
        className={ css(TilesListStyles.cell) }
        // tslint:disable-next-line:jsx-ban-props
        style={
          item.grid.mode === TilesGridMode.fillHorizontal ?
            {
              height: `${item.grid.minRowHeight}px`
            } :
            {
              paddingTop: `${(100 * itemHeightOverWidth).toFixed(2)}%`
            }
        }
      >
        <div
          role='presentation'
          className={ css(TilesListStyles.cellContent) }
        >
          { item.onRender(item.content, finalSize) }
        </div>
      </div>
    );
  }

  @autobind
  private _onRenderPage(pageProps: IPageProps, defaultRender?: IRenderFunction<IPageProps>): JSX.Element {
    const {
      page,
      className: pageClassName,
      ...divProps
    } = pageProps;

    const {
      items
    } = page;

    const data: IPageData<TItem> = page.data;

    const cells: ITileCell<TItem>[] = items || [];

    let grids: React.ReactNode[] = [];

    const previousCell = this.state.cells[page.startIndex - 1];
    const nextCell = this.state.cells[page.startIndex + page.itemCount];

    const endIndex = cells.length;

    let currentRow: IRowData | undefined;

    for (let i = 0; i < endIndex;) {
      // For each cell at the start of a grid.
      const grid = cells[i].grid;

      const renderedCells: React.ReactNode[] = [];

      const width = data.pageWidths[page.startIndex + i];

      for (; i < endIndex && cells[i].grid === grid; i++) {
        // For each cell in the current grid.
        const cell = cells[i];

        const index = page.startIndex + i;
        const cellAsFirstRow = data.rows[index];

        if (cellAsFirstRow) {
          currentRow = cellAsFirstRow;
        }

        let finalSize = data.cellSizes[index];

        if (currentRow) {
          const {
            scaleFactor
          } = currentRow;

          if ((grid.mode === TilesGridMode.fill ||
            grid.mode === TilesGridMode.fillHorizontal) &&
            (!currentRow.isLastRow ||
              scaleFactor <= grid.maxScaleFactor)) {
            const finalScaleFactor = Math.min(grid.maxScaleFactor, scaleFactor);

            finalSize = {
              width: finalSize.width * finalScaleFactor,
              height: grid.mode === TilesGridMode.fill ?
                finalSize.height * finalScaleFactor :
                grid.minRowHeight
            };
          }
        }

        renderedCells.push(
          <div
            key={ `${grid.key}-item-${cell.key}` }
            data-item-index={ index }
            className={ css('ms-List-cell', this._onGetCellClassName(), {
              [`ms-TilesList-cell--firstInRow ${TilesListStyles.cellFirstInRow}`]: !!cellAsFirstRow
            }) }
            // tslint:disable-next-line:jsx-ban-props
            style={
              {
                ...this._onGetCellStyle(cell, currentRow)
              }
            }
          >
            { this._onRenderCell(cell, finalSize) }
          </div>
        );
      }

      const isOpenStart = previousCell && previousCell.grid === grid;
      const isOpenEnd = nextCell && nextCell.grid === grid;

      const margin = grid.spacing / 2;

      grids.push(
        <div
          key={ grid.key }
          className={ css('ms-TilesList-grid', {
            [`${TilesListStyles.grid}`]: grid.mode !== TilesGridMode.none
          }) }
          // tslint:disable-next-line:jsx-ban-props
          style={
            {
              width: `${width}px`,
              margin: `${-margin}px`,
              marginTop: isOpenStart ? '0' : `${grid.marginTop - margin}px`,
              marginBottom: isOpenEnd ? '0' : `${grid.marginBottom - margin}px`
            }
          }
        >
          { ...renderedCells }
        </div>
      );
    }

    return (
      <div
        { ...divProps }
        className={ css(pageClassName, this._onGetPageClassName()) }
      >
        { grids }
      </div>
    );
  }

  @autobind
  private _getPageSpecification(startIndex: number, bounds: IRectangle): {
    itemCount: number;
    data: IPageData<TItem>;
  } {
    if (this._pageSpecificationCache) {
      if (this._pageSpecificationCache.width !== bounds.width) {
        this._pageSpecificationCache = undefined;
      }
    }

    if (!this._pageSpecificationCache) {
      this._pageSpecificationCache = {
        width: bounds.width,
        byIndex: {}
      };
    }

    const pageSpecificationCache = this._pageSpecificationCache;

    if (pageSpecificationCache.byIndex[startIndex]) {
      return pageSpecificationCache.byIndex[startIndex];
    }

    const {
      cells
    } = this.state;

    const endIndex = Math.min(cells.length, startIndex + CELLS_PER_PAGE);

    let rowWidth = 0;
    let rowStart = 0;
    let i = startIndex;

    let isAtGridEnd = true;

    const startCells: IPageData<TItem>['rows'] = {};
    let extraCells: IPageData<TItem>['extraCells'] | undefined;
    const cellSizes: IPageData<TItem>['cellSizes'] = {};
    const widths: IPageData<TItem>['pageWidths'] = {};

    for (; i < endIndex;) {
      // For each cell at the start of a grid.
      const grid = cells[i].grid;

      rowWidth = 0;
      rowStart = i;

      const boundsWidth = bounds.width + grid.spacing;

      widths[i] = boundsWidth;

      let currentRow: IRowData = startCells[i] = {
        scaleFactor: 1
      };

      if (grid.mode === TilesGridMode.none) {
        // The current "grid" just takes up the full width.
        // No flex calculations necessary.
        isAtGridEnd = true;
        cellSizes[i] = {
          width: bounds.width,
          height: 0
        };
        i++;
        continue;
      }

      for (; i < endIndex && cells[i].grid === grid; i++) {
        // For each cell in the current grid.
        const {
          aspectRatio
        } = cells[i];

        const width = aspectRatio * grid.minRowHeight + grid.spacing;

        if (rowWidth + width > boundsWidth) {
          const totalMargin = grid.spacing * (i - rowStart);
          currentRow.scaleFactor = (boundsWidth - totalMargin) / (rowWidth - totalMargin);
        }

        rowWidth += width;

        cellSizes[i] = {
          // Assign the expected base size of the cell.
          // Scaling will be handled at render time.
          width: aspectRatio * grid.minRowHeight,
          height: grid.minRowHeight
        };

        if (rowWidth > boundsWidth) {
          rowWidth = width;
          rowStart = i;
          currentRow = startCells[i] = {
            scaleFactor: 1
          };
        }
      }

      if (cells[i] && cells[i].grid === grid) {
        // If the next cell is part of a different grid.
        isAtGridEnd = false;
      } else {
        currentRow.isLastRow = true;
      }

      if (rowWidth < boundsWidth) {
        const totalMargin = grid.spacing * (i - rowStart);
        currentRow.scaleFactor = (boundsWidth - totalMargin) / (rowWidth - totalMargin);
      }

      if (!isAtGridEnd && currentRow.scaleFactor > (
        grid.mode === TilesGridMode.fill || grid.mode === TilesGridMode.fillHorizontal ?
          grid.maxScaleFactor :
          1)) {
        // If the last computed row is not the end of the grid, and the content cannot scale to fit the width,
        // declare these cells as 'extra' and let them be pushed into the next page.
        extraCells = cells.slice(rowStart, i);
      }
    }

    // If there are extra cells, cut off the page so the extra cells will be pushed into the next page.
    // Otherwise, take all the cells.
    const itemCount = i - (extraCells ? extraCells.length : 0) - startIndex;

    const pageSpecification: IPageSpecification<TItem> = {
      itemCount: itemCount,
      data: {
        pageWidths: widths,
        rows: startCells,
        extraCells: extraCells,
        cellSizes: cellSizes
      }
    };

    pageSpecificationCache.byIndex[startIndex] = pageSpecification;

    return pageSpecification;
  }

  @autobind
  private _onGetCellClassName(): string {
    return TilesListStyles.listCell;
  }

  @autobind
  private _onGetPageClassName(): string {
    return TilesListStyles.listPage;
  }

  @autobind
  private _onGetCellStyle(item: ITileCell<TItem>, currentRow?: IRowData): React.CSSProperties {
    const {
      grid: {
        mode: gridMode,
      maxScaleFactor
      },
      grid
    } = item;

    if (gridMode === TilesGridMode.none) {
      return {};
    }

    const itemWidthOverHeight = item.aspectRatio || 1;
    const margin = grid.spacing / 2;
    const isFill = gridMode === TilesGridMode.fill || gridMode === TilesGridMode.fillHorizontal;
    const width = itemWidthOverHeight * grid.minRowHeight;

    return {
      flex: isFill ? `${itemWidthOverHeight} ${itemWidthOverHeight} ${width}px` : `0 0 ${width}px`,
      maxWidth: isFill && (!currentRow || !currentRow.isLastRow || currentRow.scaleFactor <= maxScaleFactor) ?
        // Flexbox can scale the item to the maximum ratio.
        `${width * maxScaleFactor}px` :
        // The item must not be scaled.
        `${width}px`,
      margin: `${margin}px`
    };
  }

  private _getCells(items: (ITilesGridSegment<TItem> | ITilesGridItem<TItem>)[]): ITileCell<TItem>[] {
    const cells: ITileCell<TItem>[] = [];

    for (const item of items) {
      if (isGridSegment(item)) {
        const {
          spacing = 0,
          maxScaleFactor = MAX_TILE_STRETCH,
          marginBottom = 0,
          marginTop = 0,
          minAspectRatio = MIN_ASPECT_RATIO,
          maxAspectRatio = MAX_ASPECT_RATIO
        } = item;

        const grid: ITileGrid = {
          minRowHeight: item.minRowHeight,
          spacing: spacing,
          mode: item.mode,
          key: `grid-${item.key}`,
          maxScaleFactor: maxScaleFactor,
          marginTop: marginTop,
          marginBottom: marginBottom
        };

        for (const gridItem of item.items) {
          const {
            desiredSize
          } = gridItem;

          const aspectRatio = Math.min(
            maxAspectRatio,
            Math.max(
              minAspectRatio,
              desiredSize && (desiredSize.width / desiredSize.height) || 1));

          cells.push({
            aspectRatio: aspectRatio,
            content: gridItem.content,
            onRender: gridItem.onRender,
            grid: grid,
            key: gridItem.key
          });
        }
      } else {
        cells.push({
          aspectRatio: 1,
          content: item.content,
          onRender: item.onRender,
          grid: {
            minRowHeight: 0,
            spacing: 0,
            mode: TilesGridMode.none,
            key: `grid-header-${item.key}`,
            maxScaleFactor: 1,
            marginBottom: 0,
            marginTop: 0
          },
          key: `header-${item.key}`
        });
      }
    }

    return cells;
  }
}

function isGridSegment<TItem>(item: ITilesGridSegment<TItem> | ITilesGridItem<TItem>): item is ITilesGridSegment<TItem> {
  return !!(item as ITilesGridSegment<TItem>).items;
}
