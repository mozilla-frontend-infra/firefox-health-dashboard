# A Standard Chart Schema
chart definition

## `area` Property
details regarding the plot area, but nothing about the series.  Multiple areas are allowed, and may share axis.

  * `area.y` - *string* The axis used for the vertical dimension. (default = y)
  * `area.x` - *string* The axis used for the horizontal dimension. (default = x)
  * `area.style` - *object*
    * `area.style.style` - *string* css line style descriptions
    * `area.style.format` - *string* text format string
    * `area.style.color` - *string* css color
    * `area.style.visibility` - *string* initial visibility
    * `area.style.height` - *number* css height
    * `area.style.padding` - *string* css padding
    * `area.style.width` - *number* css width
    * `area.style.z-index` - *number* css z-depth
    * `area.style.font` - *string* css font
    * `area.style.border` - *string* css border
  * `area.target` - *string* for when this area is not in the chart target div
## `axis` Property
list of axis, property names not limited to 'x' and 'y'

  * `axis.y` - *object* details on a visual axis
    * `axis.y.domain` - *object* define the range of values on axis
      * `axis.y.domain.max` - *number* maximum axis value shown
      * `axis.y.domain.reversed` - *boolean* show the range reversed, greater positive numbers going down (or positive counting goes leftward)
      * `axis.y.domain.min` - *number* minimum axis value shown
      * `axis.y.domain.showZero` - *boolean* show zero coordinate, even if calculated range would not
      * `axis.y.domain.partitions` - *string* categorical dimensions require an explict list of strings
    * `axis.y.missing` - *object* information on behaviour when outside the domain or range.  Has no meaning when using the default domain.
    * `axis.y.format` - *string* format of the reference values on the axis
    * `axis.y.rug` - *boolean* show projection as a series of ticks along the axis
    * `axis.y.value` - *string* common expression to evaluate, or name of the property
    * `axis.y.label` - *string* name of axis
    * `axis.y.normalized` - *boolean* Convert to % of total
    * `axis.y.position` - *string* where to place the axis, relative to plot area (top/right/bottom/left), default=bottom
    * `axis.y.unit` - *string* the measurement unit, using multiply (`*`) and divide (`/`) operators
  * `axis.x` - *object* details on a visual axis
    * `axis.x.domain` - *object* define the range of values on axis
      * `axis.x.domain.max` - *number* maximum axis value shown
      * `axis.x.domain.reversed` - *boolean* show the range reversed, greater positive numbers going down (or positive counting goes leftward)
      * `axis.x.domain.min` - *number* minimum axis value shown
      * `axis.x.domain.showZero` - *boolean* show zero coordinate, even if calculated range would not
      * `axis.x.domain.partitions` - *string* categorical dimensions require an explict list of strings
    * `axis.x.missing` - *object* information on behaviour when outside the domain or range.  Has no meaning when using the default domain.
    * `axis.x.format` - *string* format of the reference values on the axis
    * `axis.x.rug` - *boolean* show projection as a series of ticks along the axis
    * `axis.x.value` - *string* common expression to evaluate, or name of the property
    * `axis.x.label` - *string* name of axis
    * `axis.x.normalized` - *boolean* Convert to % of total
    * `axis.x.position` - *string* where to place the axis, relative to plot area (top/right/bottom/left), default=bottom
    * `axis.x.unit` - *string* the measurement unit, using multiply (`*`) and divide (`/`) operators
## `click` (function)
function to run when a data element is clicked
## `data` Property
an array of objects

## `legend` Property
more configuration for legend

  * `legend.position` - *string* position of legend relative to plot area (top/left/bottom/right)
  * `legend.style` - *object*
    * `legend.style.style` - *string* css line style descriptions
    * `legend.style.format` - *string* text format string
    * `legend.style.color` - *string* css color
    * `legend.style.visibility` - *string* initial visibility
    * `legend.style.height` - *number* css height
    * `legend.style.padding` - *string* css padding
    * `legend.style.width` - *number* css width
    * `legend.style.z-index` - *number* css z-depth
    * `legend.style.font` - *string* css font
    * `legend.style.border` - *string* css border
  * `legend.label` - *string* name the legend
## `series` Property
what is plotted 

  * `series.style` - *object*
    * `series.style.style` - *string* css line style descriptions
    * `series.style.format` - *string* text format string
    * `series.style.color` - *string* css color
    * `series.style.visibility` - *string* initial visibility
    * `series.style.height` - *number* css height
    * `series.style.padding` - *string* css padding
    * `series.style.width` - *number* css width
    * `series.style.z-index` - *number* css z-depth
    * `series.style.bar-spacing` - *string* spacing between bars, either as pixels, or a percent of bar width.
    * `series.style.line` - *object*
      * `series.style.line.style` - *string* css line style descriptions
      * `series.style.line.format` - *string* text format string
      * `series.style.line.color` - *string* css color
      * `series.style.line.visibility` - *string* initial visibility
      * `series.style.line.height` - *number* css height
      * `series.style.line.padding` - *string* css padding
      * `series.style.line.width` - *number* css width
      * `series.style.line.z-index` - *number* css z-depth
      * `series.style.line.font` - *string* css font
      * `series.style.line.border` - *string* css border
    * `series.style.font` - *string* css font
    * `series.style.border` - *string* css border
  * `series.name` - *string* name of the series
  * `series.hoverStyle` - *object* for when hovering over datapoint
    * `series.hoverStyle.symbol` - *string* shape while hovering
    * `series.hoverStyle.style` - *object*
      * `series.hoverStyle.style.style` - *string* css line style descriptions
      * `series.hoverStyle.style.format` - *string* text format string
      * `series.hoverStyle.style.color` - *string* css color
      * `series.hoverStyle.style.visibility` - *string* initial visibility
      * `series.hoverStyle.style.height` - *number* css height
      * `series.hoverStyle.style.padding` - *string* css padding
      * `series.hoverStyle.style.width` - *number* css width
      * `series.hoverStyle.style.z-index` - *number* css z-depth
      * `series.hoverStyle.style.bar-spacing` - *string* spacing between bars, either as pixels, or a percent of bar width.
      * `series.hoverStyle.style.line` - *object*
        * `series.hoverStyle.style.line.style` - *string* css line style descriptions
        * `series.hoverStyle.style.line.format` - *string* text format string
        * `series.hoverStyle.style.line.color` - *string* css color
        * `series.hoverStyle.style.line.visibility` - *string* initial visibility
        * `series.hoverStyle.style.line.height` - *number* css height
        * `series.hoverStyle.style.line.padding` - *string* css padding
        * `series.hoverStyle.style.line.width` - *number* css width
        * `series.hoverStyle.style.line.z-index` - *number* css z-depth
        * `series.hoverStyle.style.line.font` - *string* css font
        * `series.hoverStyle.style.line.border` - *string* css border
      * `series.hoverStyle.style.font` - *string* css font
      * `series.hoverStyle.style.border` - *string* css border
    * `series.hoverStyle.size` - *number* size while hovering
  * `series.area` - *string* in the event this chart has multiple draw areas, this is the name of area this series will show in
  * `series.tip` - *object* override the general tip, for this series only
    * `series.tip.style` - *object* styling for the tooltip box
      * `series.tip.style.style` - *string* css line style descriptions
      * `series.tip.style.format` - *string* text format string
      * `series.tip.style.color` - *string* css color
      * `series.tip.style.visibility` - *string* initial visibility
      * `series.tip.style.height` - *number* css height
      * `series.tip.style.padding` - *string* css padding
      * `series.tip.style.width` - *number* css width
      * `series.tip.style.z-index` - *number* css z-depth
      * `series.tip.style.font` - *string* css font
      * `series.tip.style.border` - *string* css border
    * `series.tip.format` - *string* html template to show
  * `series.value` - *string* a shortcut for `select.value`
  * `series.label` - *string* template for the each element's name
  * `series.marker` - *object* single-value mark on one axis only
    * `series.marker.symbol` - *string* shape of datapoint
    * `series.marker.style` - *object*
      * `series.marker.style.style` - *string* css line style descriptions
      * `series.marker.style.format` - *string* text format string
      * `series.marker.style.color` - *string* css color
      * `series.marker.style.visibility` - *string* initial visibility
      * `series.marker.style.height` - *number* css height
      * `series.marker.style.padding` - *string* css padding
      * `series.marker.style.width` - *number* css width
      * `series.marker.style.z-index` - *number* css z-depth
      * `series.marker.style.bar-spacing` - *string* spacing between bars, either as pixels, or a percent of bar width.
      * `series.marker.style.line` - *object*
        * `series.marker.style.line.style` - *string* css line style descriptions
        * `series.marker.style.line.format` - *string* text format string
        * `series.marker.style.line.color` - *string* css color
        * `series.marker.style.line.visibility` - *string* initial visibility
        * `series.marker.style.line.height` - *number* css height
        * `series.marker.style.line.padding` - *string* css padding
        * `series.marker.style.line.width` - *number* css width
        * `series.marker.style.line.z-index` - *number* css z-depth
        * `series.marker.style.line.font` - *string* css font
        * `series.marker.style.line.border` - *string* css border
      * `series.marker.style.font` - *string* css font
      * `series.marker.style.border` - *string* css border
    * `series.marker.size` - *number* size of the datapoint
  * `series.type` - *string* the chart type to show as (bar/line/dot)
  * `series.click` - *function* override the general click, for this series only
  * `series.select` - *nested* selector(s) for this series.  Use an array of selectors to plot multiple dimensions
    * `series.select.range` - *object* use for range-of-values display, like whisker charts, or gantt charts.  Can not use with `series.select.value`.  Makes no sense with `dot` charts
      * `series.select.range.max` - *number* maximum value of the range, if any
      * `series.select.range.min` - *number* minimum value of the range, if any
    * `series.select.name` - *string* same as `axis` but standard with JSON query expressions
    * `series.select.value` - *string* expression to extract from data and chart
    * `series.select.axis` - *string* name of the axis to apply against: can be any #chart.axis property name.  Use tuple if plotting more than one dimension.
  * `series.axis` - *string* a shortcut for `select.axis`
## `target` (string)
name of dom elements to insert chart
## `tip` Property
Tooltip to show over chart values

  * `tip.style` - *object* styling for the tooltip box
    * `tip.style.style` - *string* css line style descriptions
    * `tip.style.format` - *string* text format string
    * `tip.style.color` - *string* css color
    * `tip.style.visibility` - *string* initial visibility
    * `tip.style.height` - *number* css height
    * `tip.style.padding` - *string* css padding
    * `tip.style.width` - *number* css width
    * `tip.style.z-index` - *number* css z-depth
    * `tip.style.font` - *string* css font
    * `tip.style.border` - *string* css border
  * `tip.format` - *string* html template to show
## `title` Property
details regarding the title.  Can also be a simple string.

  * `title.position` - *string* location of title relative to area (default=top)
  * `title.description` - *string* detail text shown while hovering over title (default=null)
  * `title.label` - *string* actual text of the title