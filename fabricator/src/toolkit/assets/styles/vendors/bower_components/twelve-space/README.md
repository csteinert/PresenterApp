Twelve-Space  [v1.0.0]
=====

A Sass-based, [BEM](http://bem.info), OOCSS framework for creating DOM modules.

### Use Twelve-Space for:
* **Base code** — Start projects quicker
  * Includes [Helper Classes](#helper-classes)
* **Module design** — Create reusable code 
* **Rapid prototying** —  Design in the browser
* **Design patterns** — Design sophisticated scenes


### Demos
Check out some [basic demos](http://kevinmack18.github.io/Twelve-Space).


### Video Overview
Watch "**[Intro to the Twelve-Space Structure System](https://www.youtube.com/watch?v=TOBS_xKrvGE)**" on YouTube for project overview, demos, and learn how to get started.

---

## How to Use

Twelve-Space can be used as Sass [@extend](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#extend) with placeholders or compile CSS. Options for compiling the CSS are located in the `_twelve-space__variables.scss` file.


## Selector Syntax

### Placeholder Selectors
All selectors have a [placeholder selector](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#placeholder_selectors_) and can be `@extend`ed whether or not you have the CSS being compiled.

* **`%space`**
 * `%space--12`
 * `%space--table--12`
 * `%space--equal--1` — `%space--equal--12`

* **`%space__cell`**
 * **`%space__cell--1`** — **`%space__cell--12`**
     * `%space__cell--` + # + `__expand--` + #
     * `%space__cell--` + # + `__offset--` + #
     * `%space__cell--` + # + `__offset--negative--` + #
     * `%space__cell--` + # + `__gap--left--` + #
     * `%space__cell--` + # + `__gap--right--` + #
 * `%space__cell--offset--1` — `%space__cell--offset--12`
 * `%space__cell--offset--negative--1` — `%space__cell--offset--negative--12`
 * `%space--table__cell--1` — `%space--table__cell--12`

* `%space__gap--right`
 * `%space__gap--right--1` — `%space__gap--right--12`
* `%space__gap--padding--right`
 * `%space__gap--padding--right--1` — `%space__gap--padding--right--12`

* `%space__gap--left`
 * `%space__gap--left--1` — `%space__gap--left--12`
* `%space__gap--padding--left`
 * `%space__gap--padding--left--1` — `%space__gap--padding--left--12`

* `%space__row`
 
### Default Selectors
By default the naming convention is block name called "space" and element called "cell". `__twelve-space__variables.scss` has options to update or change the naming conventions.

* **`.space`**
 * `.space--12`
 * `.space--table--12`
 * `.space--equal--1` — `.space--equal--12`

* **`.space__cell`**
 * **`.space__cell--1`** — **`.space__cell--12`**
     * `.space__cell--` + # + `__expand--` + #
     * `.space__cell--` + # + `__offset--` + #
     * `.space__cell--` + # + `__offset--negative--` + #
     * `.space__cell--` + # + `__gap--left--` + #
     * `.space__cell--` + # + `__gap--right--` + #
 * `.space__cell--offset--1` — `.space__cell--offset--12`
 * `.space__cell--offset--negative--1` — `.space__cell--offset--negative--12`
 * `.space--table__cell--1` — `.space--table__cell--12`

* `.space__gap--right`
 * `.space__gap--right--1` — `.space__gap--right--12`
* `.space__gap--padding--right`
 * `.space__gap--padding--right--1` — `.space__gap--padding--right--12`

* `.space__gap--left`
 * `.space__gap--left--1` — `.space__gap--left--12`
* `.space__gap--padding--left`
 * `.space__gap--padding--left--1` — `.space__gap--padding--left--12`

* `.space__row`

---

## <a name="helper-classes"></a>Helper Classes

There are a series of helper classes to help assist your structures and your project. All Helper Classes have both placeholder selector for all types and CSS compilation options.

### Display Types
* `%display-hidden`, `%hidden`, `%hide`, `%display-block`, `%block`, `%show`, `%display-inline-block`, `%inline-block`, `%display-inline`, `%inline`, `%display-table`, `%table`, `%display-table-cell`, `%table-cell `


### Position Types and Z-Index
* `%position-relative`, `%relative`, `%position-absolute`, `%absolute`, `%position-fixed`, `%fixed`, `%position-relative--1` — `%position-relative--12`, `%position-absolute--1` — `%position-absolute--12`, `%position-fixed--1` — `%position-fixed--12`

### Overflow Types
* `%overflow-x-hidden`, `%hidden-x`, `%overflow-y-hidden`, `%hidden-y`, `%overflow-hidden`, `%hidden`

### Alignment Types
* `%vertical-align`, `%center`, `%vertical-align-middle`, `%vertical-align-baseline`, `%vertical-align-text-bottom`, `%vertical-align-top`, `%vertical-align-bottom`
 
### Width Types
* `%width-100`, `%full`

---

## Dependency

* [Sass](http://sass-lang.com/) — [Install](http://sass-lang.com/install)

---


## Contribute

Help find bugs, log issues, log enhancements, or create pull requests. Let's make this something great! Thank you
