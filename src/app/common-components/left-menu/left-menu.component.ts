/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, Injectable, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonService } from '../../services/common.service';

const LOAD_MORE = 'LOAD_MORE';
type menuData = {menuKey: number, menuName: string, label: string};

/** Nested node */
export class LoadmoreNode {
  childrenChange = new BehaviorSubject<LoadmoreNode[]>([]);

  get children(): LoadmoreNode[] {
    return this.childrenChange.value;
  }

  constructor(
    public menu: menuData,
    public hasChildren = false,
    public loadMoreParentMenu: menuData | null = null
    ) { }
}

/** Flat node with expandable and level information */
export class LoadmoreFlatNode {
  constructor(
    // public menuKey: number,//jey 추가
    public menu: menuData,
    public level = 1,
    public expandable = false,
    public loadMoreParentMenu: menuData | null = null
    ) { }
}

/**
 * A database that only load part of the data initially. After user clicks on the `Load more`
 * button, more data will be loaded.
 */
@Injectable()
export class LoadmoreDatabase {
  batchNumber = 5;
  dataChange = new BehaviorSubject<LoadmoreNode[]>([]);
  nodeMap = new Map<menuData, LoadmoreNode>();

  /** The data */
  // rootLevelNodes: string[] = ['Vegetables', 'Fruits'];
  // dataMap = new Map<string, string[]>([
  //   ['Fruits', ['Apple', 'Orange', 'Banana']],
  //   ['Vegetables', ['Tomato', 'Potato', 'Onion']],
  //   ['Apple', ['Fuji', 'Macintosh']],
  //   ['Onion', ['Yellow', 'White', 'Purple', 'Green', 'Shallot', 'Sweet', 'Red', 'Leek']],
  // ]);

  /* 데이터교체 */
  menuParent: Array<menuData> = [
    {menuKey: 1, menuName:'mypage', label:'마이페이지'}, 
    {menuKey: 2, menuName:'assets-management', label:'비품관리'}
  ];
  menuChildren = new Map<menuData, Array<menuData>>([
    [
      /* 첫번째 메뉴 */
      {menuKey: 2, menuName:'assets-management', label: '비품관리'},
      [
        {menuKey: 21, menuName:'assets-management', label: '비품목록'}, 
        {menuKey: 22, menuName:'assets-management', label: '비품등록'}
      ]
    ]
  ]);

  initialize() {
    //기존코드 주석
    // const data = this.rootLevelNodes.map(name => this._generateNode(name));
    // this.dataChange.next(data);

    //은영코드
    const data = this.menuParent.map(parent => this._generateNode(parent));
    this.dataChange.next(data);
  }

  /** Expand a node whose children are not loaded */
  loadMore(menu: menuData, onlyFirstTime = false) {
    if (!this.nodeMap.has(menu) || !this.menuChildren.has(menu)) {
      return;
    }
    const parent = this.nodeMap.get(menu)!;
    const children = this.menuChildren.get(menu)!;
    if (onlyFirstTime && parent.children!.length > 0) {
      return;
    }
    const newChildrenNumber = parent.children!.length + this.batchNumber;
    const nodes = children.slice(0, newChildrenNumber)
      .map(name => this._generateNode(name));
    if (newChildrenNumber < children.length) {
      // Need a new load more node
      let LOAD_MORE = {menuKey: 21, menuName:'LOAD_MORE', label: '비품목록'}
      nodes.push(new LoadmoreNode(LOAD_MORE, false, menu));
    }

    parent.childrenChange.next(nodes);
    this.dataChange.next(this.dataChange.value);
  }

  private _generateNode(menu: menuData): LoadmoreNode {
    if (this.nodeMap.has(menu)) {
      return this.nodeMap.get(menu)!;
    }
    const result = new LoadmoreNode(menu, this.menuChildren.has(menu));
    this.nodeMap.set(menu, result);
    return result;
  }
}
//org
//   loadMore(item: string, onlyFirstTime = false) {
//     if (!this.nodeMap.has(item) || !this.menuChildren.has(item)) {
//       return;
//     }
//     const parent = this.nodeMap.get(item)!;
//     const children = this.menuChildren.get(item)!;
//     if (onlyFirstTime && parent.children!.length > 0) {
//       return;
//     }
//     const newChildrenNumber = parent.children!.length + this.batchNumber;
//     const nodes = children.slice(0, newChildrenNumber)
//       .map(name => this._generateNode(name));
//     if (newChildrenNumber < children.length) {
//       // Need a new load more node
//       nodes.push(new LoadmoreNode(LOAD_MORE, false, item));
//     }

//     parent.childrenChange.next(nodes);
//     this.dataChange.next(this.dataChange.value);
//   }

//   private _generateNode(item: string): LoadmoreNode {
//     if (this.nodeMap.has(item)) {
//       return this.nodeMap.get(item)!;
//     }
//     const result = new LoadmoreNode(item, this.menuChildren.has(item));
//     this.nodeMap.set(item, result);
//     return result;
//   }
// }

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
  providers: [LoadmoreDatabase]
})
export class LeftMenuComponent implements OnInit {
  @ViewChild('_tree', { static: false }) _tree: ElementRef;
  @ViewChild('_bgShadow', { static: false }) _bgShadow: ElementRef;

  nodeMap = new Map<menuData, LoadmoreFlatNode>();
  treeControl: FlatTreeControl<LoadmoreFlatNode>;
  treeFlattener: MatTreeFlattener<LoadmoreNode, LoadmoreFlatNode>;
  // Flat tree data source
  dataSource: MatTreeFlatDataSource<LoadmoreNode, LoadmoreFlatNode>;

  public st = null;

  constructor(
    private _database: LoadmoreDatabase,
    @Inject(CommonService) private commonService: CommonService
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);

    this.treeControl = new FlatTreeControl<LoadmoreFlatNode>(this.getLevel, this.isExpandable);

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
    _database.initialize();
  }

  ngOnInit() {
  }

  getChildren = (node: LoadmoreNode): Observable<LoadmoreNode[]> => node.childrenChange;

  transformer = (node: LoadmoreNode, level: number) => {
    const existingNode = this.nodeMap.get(node.menu);

    if (existingNode) {
      return existingNode;
    }

    const newNode =
      new LoadmoreFlatNode(node.menu, level, node.hasChildren, node.loadMoreParentMenu);
    this.nodeMap.set(node.menu, newNode);
    return newNode;
  }

  // getMenuKey = (node: LoadmoreFlatNode) => node.menu.menuKey;

  getLevel = (node: LoadmoreFlatNode) => node.level;

  isExpandable = (node: LoadmoreFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: LoadmoreFlatNode) => _nodeData.expandable;

  isLoadMore = (_: number, _nodeData: LoadmoreFlatNode) => false;
  // isLoadMore = (_: number, _nodeData: LoadmoreFlatNode) => _nodeData.menu === LOAD_MORE;

  /** Load more nodes from data source */
  loadMore(menu: menuData) {
    this._database.loadMore(menu);
  }

  loadChildren(node: LoadmoreFlatNode) {
    this._database.loadMore(node.menu, true);
  }

  /**
   * @description 메뉴 토글
   */
  toggleLeftMenu(): void {
    let promise = new Promise((resolve, reject) => {
      if(this.commonService.leftMenuOpenFlag){
        this.removeBgShadow();
      } else {
        this._tree.nativeElement.style.left = '0px'
        this.showBgShadow();
      }
    });
  }

  /**
   * @description 배경 음영처리
   */
  showBgShadow() {
    this._bgShadow.nativeElement.style.display = 'block'
    this._bgShadow.nativeElement.style.opacity = '1'
    this.commonService.leftMenuOpenFlag = true;
  }

  /**
   * @description 메뉴 닫기
   */
  removeBgShadow() {
    this._tree.nativeElement.style.left = '-280px'
    this._bgShadow.nativeElement.style.opacity = '0'
    this._bgShadow.nativeElement.style.display = 'none'
    this.commonService.leftMenuOpenFlag = false;

    //딜레이로 인한 오류가 생겨 삭제
    // this.st = setTimeout(() => {
    //   this._bgShadow.nativeElement.style.display = 'none'
    //   clearTimeout(this.st);
    // }, 500);
  }

  logNode(node){
    console.log(node)
    // console.log(this.getMenuKey(node))
  }
}
