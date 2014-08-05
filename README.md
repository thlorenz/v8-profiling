# v8-profiling

Exploring how to hook into the various v8 profilers.

## Tools

Interesting tools found inside `./tools`:

### gc-nvp-trace-processor.py

- plots charts based on GC traces produced by running v8 with `--trace-gc --trace-gc-nvp`
- plotting performed with [gnuplot](http://www.gnuplot.info/) (needs [aquaterm](http://sourceforge.net/projects/aquaterm/) on Mac or just `brew install gnuplot`)
- invoke `./gc-nvp-trace-processor <tracefile>`

[![sample](http://thlorenz.github.io/v8-profiling/demos/gc-nvp-trace-processor/tracing-gc.txt_0.png)](http://thlorenz.github.io/v8-profiling/demos/gc-nvp-trace-processor/)

[full demo](http://thlorenz.github.io/v8-profiling/demos/gc-nvp-trace-processor/)

### gdb-v8-support.py

- v8 value pretty printers for gdb
- should be easy to adapt to work with lldb?

### gen-postmortem-metadata.py

- generates C++ file to be compiled and linked into libv8 to support postmortem debugging tools
- emits constants describing v8 internals
  - `v8dbg_type_CLASS__TYPE = VALUE`           Describes class type values
  - `v8dbg_class_CLASS__FIELD__TYPE = OFFSET`  Describes class fields
  - `v8dbg_parent_CLASS__PARENT`               Describes class hierarchy
  - `v8dbg_frametype_NAME = VALUE`             Describes stack frame values
  - `v8dbg_off_fp_NAME = OFFSET`               Frame pointer offsets
  - `v8dbg_prop_NAME = OFFSET`                 Object property offsets
  - `v8dbg_NAME = VALUE`                       Miscellaneous values

