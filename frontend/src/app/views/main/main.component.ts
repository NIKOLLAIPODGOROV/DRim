import {Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild,} from '@angular/core';
import {ArticleType} from "../../../types/article.type";
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleService} from "../../shared/services/article.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../core/auth/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RequestService} from "../../shared/services/request.service";
import {RequestsType} from "../../../types/requests.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {Subject, Subscription, takeUntil} from "rxjs";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit, OnDestroy {

  isFormEmpty: boolean = false;
  @Input() popularArticles: ArticleType[] = [];
  @Input() article!: ArticleType;
  @Input() type!: string;
  articles: ArticleType[] = [];

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
    },
    nav: true
  };

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 25,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
    },
    nav: false
  };


  mains = [
{
  image: 'Banner1.png'
},
    {
      image: 'Banner2.png'
    },
    {
      image: 'Banner3.png'
    }
  ]

  reviews = [
    {
      name: 'Станислав',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      name: 'Аделина',
      image: 'review4.png',
      text: 'Электронный документооборот, минимум бюрократии, отдел кадров максимально приятный. Достойная зп. Много бонусов, дмс. Интересные проекты'
    },
    {
      name: 'Яника',
      image: 'review5.png',
      text: 'свобода в разработке, интересные проекты, использования современных подходов'
    },
    {
      name: 'Марина',
      image: 'review6.png',
      text: 'Хороший коллектив, удобный график,карьерный рост ,зп без задержек'
    },
  ];


  callForm = this.fb.group({
    service: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required],
    type: ['order',],
  });

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null;

  isLogged: boolean = false;

  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,
              private requestService: RequestService,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private dialog: MatDialog,
              private fb: FormBuilder,
              private router: Router,) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  private subscription: Subscription | null = null;
 // private _destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });


  this.subscription = this.activatedRoute.params
     // .pipe(
     //   takeUntil(this._destroy$)
     // )
     .subscribe(params => {
      this.articleService.getPopularArticles()
        .subscribe(data => {
          this.popularArticles = data as ArticleType[];
        });
    });
  }

  createAuthRequest() {
if (this.isLogged) {
    if (this.callForm.valid && this.callForm.value.name
      && this.callForm.value.phone && this.callForm.value.service) {

      const paramsObject: RequestsType = {
        service: this.callForm.value.service,
        name: this.callForm.value.name,
        phone: this.callForm.value.phone,
        type: 'order',
      };

      this.requestService.createAuthRequest(paramsObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              this.isFormEmpty = true;
              throw new Error(((data as DefaultResponseType).message));
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка заказа');
            }
          }
        });
    } else {
      this.isFormEmpty = false;
      this.callForm.markAllAsTouched();
      this._snackBar.open('Заполните необходимые поля');
    }
    }
  }

  closePopup() {
    this.dialogRef?.close();
    this.router.navigate(['/']);
  }

  call() {
    this.dialogRef = this.dialog.open(this.popup);
    this.dialogRef.backdropClick()
      .subscribe(() => {
        this.router.navigate(['/']);
      });

    this.isFormEmpty = true;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
   //  this._destroy$.next();
   //  this._destroy$.complete();
  }
}
