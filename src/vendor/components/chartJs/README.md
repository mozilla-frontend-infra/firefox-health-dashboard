Proposed Chart API
==================

Yet another chart API!  The priorities are:

1. No magic labels or prefixes - A surprising number APIs use a concatenation-
of-names to inject parameter values.  We will prefer the use of objects for compound values.
2. Use CSS style names - use camelCase names, avoid names that break rule #1
3. `data` is assumed to be an Array of Objects, or a jx query result.
4. `value` is can be a property name, or a jx expression

If two, or more, charts share the same `axis` (as in `===`), they are 
considered *linked*, and act as a single chart.  Use the [`$ref` property](https://github.com/klahnakoski/pyLibrary/tree/dev/pyLibrary/jsons#) to 
define a shared axis.


[Link to the chart schema](chartSchema.md)



