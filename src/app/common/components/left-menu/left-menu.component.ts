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
import { Router } from '@angular/router';

// const LOAD_MORE = 'LOAD_MORE'; //기존
const LOAD_MORE = {idx: '0', menuPath:'LOAD_MORE', label: 'more'} //변경

/* 
 * idx: 메뉴번호 
 * menuCode: 메뉴
 * label: 메뉴명
 */
type menuData = {idx: string, menuPath: string, label: string};

/** Nested node */
export class LoadmoreNode {
  childrenChange = new BehaviorSubject<LoadmoreNode[]>([]);

  get children(): LoadmoreNode[] {
    return this.childrenChange.value;
  }

  constructor(
    public idx: string,
    public menu: menuData,
    public hasChildren = false,
    public loadMoreParentMenu: string | null = null
    ) { }
}

/** Flat node with expandable and level information */
export class LoadmoreFlatNode {
  constructor(
    public idx: string,
    public menu: menuData,
    public level = 1,
    public expandable = false,
    public loadMoreParentMenu: string | null = null
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
  nodeMap = new Map<string, LoadmoreNode>();

  /** 기존 데이터 */
  // rootLevelNodes: string[] = ['Vegetables', 'Fruits'];
  // dataMap = new Map<string, string[]>([
  //   ['Fruits', ['Apple', 'Orange', 'Banana']],
  //   ['Vegetables', ['Tomato', 'Potato', 'Onion']],
  //   ['Apple', ['Fuji', 'Macintosh']],
  //   ['Onion', ['Yellow', 'White', 'Purple', 'Green', 'Shallot', 'Sweet', 'Red', 'Leek']],
  // ]);

  /* rootLevelNodes 데이터교체 */
  menuParent: Array<menuData> = [
    {idx: '1', menuPath:'company-management/assets-management', label:'비품관리'}, 
    {idx: '2', menuPath:'company-management/library-management', label:'도서관리'},
    {idx: '3', menuPath:'company-management/employee-management', label:'사원관리'},
    {idx: '4', menuPath:'company-management/document-management', label:'서류관리'},
    {idx: '5', menuPath:'company-management/mypage', label:'My page'}
  ];

  /* dataMap 데이터교체 */
  menuChildren = new Map<string, Array<menuData>>([
    /* 첫번째 메뉴 */
    [ '1',
      [
        {idx: '1-1', menuPath:'company-management/assets-list', label: '비품목록'}, 
        {idx: '1-2', menuPath:'company-management/assets-write', label: '비품등록'},
        {idx: '1-3', menuPath:'company-management/assets-location', label: '비품위치'}
      ]
    ],
    /* 두번째 메뉴 */
    [ '2',
      [
        {idx: '2-1', menuPath:'company-management/library-list', label: '도서목록'}, 
        {idx: '2-2', menuPath:'company-management/library-write', label: '도서등록'}
      ]
    ],
    /* 네번째 메뉴 */
    [ '4',
      [
        {idx: '4-1', menuPath:'company-management/document-form', label: '서류양식'}
      ]
    ]
    /* menuChildren 하위 menuChildren 가능 */
    // '1-1' ..
  ]);

  initialize() {
    //기존코드 주석
    // const data = this.rootLevelNodes.map(name => this._generateNode(name));
    // this.dataChange.next(data);

    //은영코드
    const data = this.menuParent.map(parent => this._generateNode(parent.idx, 'parent'));
    this.dataChange.next(data);
  }

  /** Expand a node whose children are not loaded */
  loadMore(menu: string, onlyFirstTime = false) {
    if (!this.nodeMap.has(menu) || !this.menuChildren.has(menu)) {
      return;
    }
    const parent = this.nodeMap.get(menu)!;
    const children = this.menuChildren.get(menu)!;
    if (onlyFirstTime && parent.children!.length > 0) {
      return;
    }
    const newChildrenNumber = parent.children!.length + this.batchNumber;
    const nodes = children.slice(0, newChildrenNumber).map(child => this._generateNode(child.idx, 'child'));
    
    if (newChildrenNumber < children.length) {
      // Need a new load more node
      let LOAD_MORE = {idx: '0', menuPath:'LOAD_MORE', label: '비품목록'}
      nodes.push(new LoadmoreNode('LOAD_MORE', LOAD_MORE, false, menu));
    }

    parent.childrenChange.next(nodes);
    this.dataChange.next(this.dataChange.value);
  }

  /**
   * @description 상위 메뉴 연결
   * @param menu 
   */
  private _generateNode(idx: string, type: string): LoadmoreNode {
    let menuData = null;
    let entries = null;
    let size = 0;

    //이미 존재하는 메뉴면 반환(으로 추정, 기존소스)
    if (this.nodeMap.has(idx)) {
      return this.nodeMap.get(idx)!;
    }

    //추가 소스, 메뉴 노드 반환
    if (type=='parent') {
      entries = this.menuParent;
      size = this.menuParent.length;

      if(entries.find(menu=>menu.idx==idx)){
        menuData = entries.find(menu=>menu.idx==idx)
      }

    } else if (type=='child') {
      entries = this.menuChildren.entries();
      size = this.menuChildren.size;

      for(let i=0; i<size; i++) {
        let node = entries.next().value;
        
        if(node) {
          if(node[1].find(menu=>menu.idx==idx)){
            menuData = node[1].find(menu=>menu.idx==idx)
          }
        }
      }
    }

    
    const result = new LoadmoreNode(idx, menuData, this.menuChildren.has(idx));
    this.nodeMap.set(idx, result);
    return result;
  }
}

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
  providers: [LoadmoreDatabase]
})
export class LeftMenuComponent implements OnInit {
  @ViewChild('_tree', { static: false }) _tree: ElementRef;
  @ViewChild('_bgShadow', { static: false }) _bgShadow: ElementRef;

  nodeMap = new Map<string, LoadmoreFlatNode>();
  treeControl: FlatTreeControl<LoadmoreFlatNode>;
  treeFlattener: MatTreeFlattener<LoadmoreNode, LoadmoreFlatNode>;
  // Flat tree data source
  dataSource: MatTreeFlatDataSource<LoadmoreNode, LoadmoreFlatNode>;

  public st = null;

  constructor(
    @Inject(CommonService) private commonService: CommonService,
    private _database: LoadmoreDatabase,
    private router: Router
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
    const existingNode = this.nodeMap.get(node.idx);

    if (existingNode) {
      return existingNode;
    }

    const newNode =
      new LoadmoreFlatNode(node.idx, node.menu, level, node.hasChildren, node.loadMoreParentMenu);
    this.nodeMap.set(node.idx, newNode);
    return newNode;
  }

  getMenuIdx = (node: LoadmoreFlatNode) => node.menu.idx; //메뉴 번호 반환

  getLevel = (node: LoadmoreFlatNode) => node.level;

  isExpandable = (node: LoadmoreFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: LoadmoreFlatNode) => _nodeData.expandable;

  // isLoadMore = (_: number, _nodeData: LoadmoreFlatNode) => true;
  isLoadMore = (_: number, _nodeData: LoadmoreFlatNode) => _nodeData.menu == LOAD_MORE;

  /** Load more nodes from data source */
  loadMore(menu: string) {
    this._database.loadMore(menu);
  }

  loadChildren(node: LoadmoreFlatNode) {
    this._database.loadMore(node.idx, true);
  }

  /**
   * @description 메뉴 토글
   */
  toggleLeftMenu(): void {
    let promise = new Promise((resolve, reject) => {
      if(this.commonService.leftMenuOpenFlag){
        this.removeBgShadow();
      } else {
        this.showBgShadow();
      }
    });
  }

  /**
   * @description 배경 음영처리
   */
  showBgShadow() {
    this._tree.nativeElement.style.left = '0px'
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
  }

  /**
   * @description 메뉴이동
   * @param node 
   */
  goMenu(node: LoadmoreNode) {
    if(node.idx!='0' && node.menu.menuPath) {
      this.router.navigate(['/'+node.menu.menuPath])
      .catch(err=>{
        console.error(err);

        alert('준비중입니다.')
      })
      .finally(()=>{
        this.removeBgShadow();
      });
    }
  }
}
