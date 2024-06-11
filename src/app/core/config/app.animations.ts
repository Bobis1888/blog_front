import {animate, animateChild, group, query, style, transition, trigger} from "@angular/animations";

export const animations = [
  trigger(
    'opacity-1',
    [
      transition(
        ':enter',
        [
          style({opacity: 0}),
          animate('1s ease-out',
            style({opacity: 1}))
        ]
      ),
      transition(
        ':leave',
        [
          style({opacity: 1}),
          animate('1s ease-in',
            style({opacity: 0}))
        ]
      )
    ]
  ),
  trigger(
    'opacity-15',
    [
      transition(
        ':enter',
        [
          style({opacity: 0}),
          animate('1500ms ease-out',
            style({opacity: 1}))
        ]
      ),
      transition(
        ':leave',
        [
          style({opacity: 1}),
          animate('1500ms ease-in',
            style({opacity: 0}))
        ]
      )
    ]
  ),
  trigger(
    'opacity-2',
    [
      transition(
        ':enter',
        [
          style({opacity: 0}),
          animate('2s ease-out',
            style({opacity: 1}))
        ]
      ),
      transition(
        ':leave',
        [
          style({opacity: 1}),
          animate('2s ease-in',
            style({opacity: 0}))
        ]
      )
    ]
  ),
  trigger('routeAnimations', [
    transition('* <=> *', [
      style({position: 'relative'}),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], {optional: true}),
      query(':enter', [
        style({opacity: 0})
      ], {optional: true}),
      query(':leave', animateChild(), {optional: true}),
      group([
        query(':leave', [
          animate('500ms ease-out', style({opacity: 0}))
        ], {optional: true}),
        query(':enter', [
          animate('500ms ease-out', style({opacity: 1}))
        ], {optional: true}),
        query('@*', animateChild(), {optional: true})
      ]),
    ])
  ])
]
