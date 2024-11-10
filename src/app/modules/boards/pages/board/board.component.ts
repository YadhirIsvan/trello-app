import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Dialog } from '@angular/cdk/dialog';
import { TodoDialogComponent } from '@boards/components/todo-dialog/todo-dialog.component';

import { CardService } from '@services/card.service';
import { BoardsService } from '@services/boards.service';
import { ActivatedRoute } from '@angular/router';
import { Board } from '@models/board.model';
import { Card } from '@models/card.model';
import { List } from '@models/list.model';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import {
  faBell,
  faAdd,
  faInfoCircle,
  faClose,
  faAngleDown,
  faL
} from '@fortawesome/free-solid-svg-icons';
import { ListsService } from '@services/List.service';
import { BACKGROUNDS } from '@models/colors.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styles: [
    `
      .cdk-drop-list-dragging .cdk-drag {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      .cdk-drag-animating {
        transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class BoardComponent implements OnInit, OnDestroy {

  faClose = faClose;
  faAdd = faAdd;
  board: Board | null = null;

  // columns: Column[] = [
  //   {
  //     title: 'ToDo',
  //     todos: [
  //       {
  //         id: '1',
  //         title: 'Make dishes',
  //       },
  //       {
  //         id: '2',
  //         title: 'Buy a unicorn',
  //       },
  //     ],
  //   },
  //   {
  //     title: 'Doing',
  //     todos: [
  //       {
  //         id: '3',
  //         title: 'Watch Angular Path in Platzi',
  //       },
  //     ],
  //   },
  //   {
  //     title: 'Done',
  //     todos: [
  //       {
  //         id: '4',
  //         title: 'Play video games',
  //       },
  //     ],
  //   },
  // ];

  // todos: ToDo[] = [];
  // doing: ToDo[] = [];
  // done: ToDo[] = [];

  inputCard = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required]
  });


  inputList = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required]
  });

  showListForm = false;
  colorBackgrounds = BACKGROUNDS;

  constructor(private dialog: Dialog,
    private route: ActivatedRoute,
    private boardsService: BoardsService,
    private cardsService: CardService,
    private formBuilder: FormBuilder,
    private listsService: ListsService
  ) {}

  ngOnDestroy(): void {
    this.boardsService.setBackgroundColor('sky');
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('boardId');
      if (id) {
        this.getBoard(id);
      }
    });
  }

  drop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    const position = this.boardsService.getPosition(event.container.data,event.currentIndex);
    const card = event.container.data[event.currentIndex];
    const listId = event.container.id;
    this.updateCard(card, position, listId);
  }

  addList() {
    const title = this.inputList.value;
    if(this.board) {
      this.listsService.create({
        title,
        boardId: this.board.id,
        position: this.boardsService.getPositionNewItem(this.board.lists)
      })
      .subscribe(list => {
        this.board?.lists.push({
          ...list,
          cards: []
        });
        this.showListForm = false;
        this.inputList.setValue('');
      })
    }
  }

  openDialog(card: Card) {
    console.log(card)
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      minWidth: '300px',
      maxWidth: '50%',
      data: {
        card: card,
      },
    });
    dialogRef.closed.subscribe((output) => {
      console.log(output);
    });
  }

  private getBoard(id: string) {
    this.boardsService.getBoard(id)
    .subscribe(board => {
      this.board = board;
      this.boardsService.setBackgroundColor(this.board.backgroundColor);
    });
  }

  private updateCard(card: Card, position: number, listId:string | number) {
    this.cardsService.update(card.id, {position, listId})
    .subscribe((cardUpdate) => {
      console.log(cardUpdate)
    });
  }

  openFormCard(list: List) {
    if (this.board?.lists) {
      this.board.lists = this.board.lists.map(iteratorList => {
        if(iteratorList.id === list.id) {
          return {
            ...iteratorList,
            showCartForm: true
          }
        }
        return {
          ...iteratorList,
          showCartForm: false
        }
      });
    }
  }

  createCard(list: List) {
    const title = this.inputCard.value;
    if (this.board) {
      this.cardsService.create({
        title,
        listId: list.id,
        boardId: this.board.id,
        position: this.boardsService.getPositionNewItem(list.cards),
      }).subscribe(card => {
        list.cards.push(card);
        this.inputCard.setValue('');
        list.showCartForm = false;
      })
    }
  }

  closeCardForm(list: List) {
    list.showCartForm = false;
  }

  get colors() {
    if (this.board) {
      const classes = this.colorBackgrounds[this.board.backgroundColor];
      return classes ? classes : {};
    }
    return {}
  }
}
