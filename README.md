# Flutter Tree

## Description

Extension for Flutter to build basic widget tree with nice syntax.

## Syntax

### Base syntax

``` dart
OneChild>MultipleChild[OneChild,MultipleChild[OneChild,OneChild],OneChild>OneChild]
```

### Code generated

``` dart
OneChild(
    child: MultipleChild(
        children: <Widget>[
            OneChild(),
            MultipleChild(
                children: <Widget>[
                    OneChild(),
                    OneChild(),
                ]
            ),
            OneChild(
                child: OneChild(),
            ),
        ]
    ),
),
```

### Use

Create single child widget

``` dart
SingleChildWidget>Child
```

``` dart
SingleChildWidget(
    child: Child(),
),
```

Create multiple child widget
``` dart
MultipleChildWidget[ChildOne,ChildTwo]
```

``` dart
MultipleChildWidget(
    children: <Widget>[
        ChildOne(),
        ChildTwo(),
    ],
),
```

You can create nested widgets.

``` dart
MultipleChild[ChildOne,ChildTwo>NestedChild>Child]
```

``` dart
MultipleChild(
    children: <Widget>[
        ChildOne(),
        ChildTwo(
            child: NestedChild(
                child: Child(),
            ),
        ),
    ],
),
```

## Requirements

Supported language:

- Dart

### 1.0.0

Core and use with abbreviation.
