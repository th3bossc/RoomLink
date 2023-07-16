import {
    trigger,
    transition,
    style,
    query,
    group,
    animateChild,
    animate,
    keyframes,
    state,
} from '@angular/animations';


export const slideInRight = trigger('openChat', [
    state('open', style({
        position : 'relative',
        transform : 'translateX(0%)',
    })),
    state('close', style({
        position : 'relative',
        left : 0,
        transform : 'translateX(120%)'
    })),
    transition ('* => *', animate('300ms ease-in-out')),
])

export const routeAnimations = trigger('routeAnimation', [
    transition('* <=> *', [
        // Set a default  style for enter and leave
        query(':enter, :leave', [
          style({
            position: 'absolute',
            left: 0,
            width: '100%',
            opacity: 0,
            transform: 'scale(100) translateY(100%)',
          }),
        ]),
        // Animate the new page in
        query(':enter', [
          animate('6000ms ease', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
        ])
      ]),
]);

export const slider =
  trigger('routeAnimations', [
    transition('* => isLeft', slideTo('left') ),
    transition('* => isRight', slideTo('right') ),
    transition('isRight => *', slideTo('left') ),
    transition('isLeft => *', slideTo('right') )
  ]);

function slideTo(direction) {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        [direction]: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ [direction]: '-100%'})
    ]),
    group([
      query(':leave', [
        animate('600ms ease', style({ [direction]: '100%'}))
      ], optional),
      query(':enter', [
        animate('600ms ease', style({ [direction]: '0%'}))
      ])
    ]),
    // Normalize the page style... Might not be necessary

    // Required only if you have child animations on the page
    // query(':leave', animateChild()),
    // query(':enter', animateChild()),
  ];
}

export const stepper =
  trigger('routeAnimations', [
    transition('* <=> *', [
      query(':enter, :leave', [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
        }),
      ]),
      group([
        query(':enter', [
          animate('600ms ease', keyframes([
            style({ opacity : 0, transform: 'scale(0.7)' }),
            style({ opacity : 1, transform: 'scale(1)' }),
          ])),
        ]),
        query(':leave', [
          animate('600ms ease', keyframes([
            style({ transform: 'scale(1)' }),
            style({ opacity: 0, transform: 'scale(1.42)' }),
          ])),
        ])
      ]),
    ])

]);