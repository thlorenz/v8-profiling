# v8-profiling

Exploring how to hook into the various v8 profilers.

## Tools

Interesting tools found inside `./tools`:

### gc-nvp-trace-processor.py

- plots charts based on GC traces produced by running v8 with `--trace-gc --trace-gc-nvp`
- plotting performed with [gnuplot](http://www.gnuplot.info/) (needs [aquaterm](http://sourceforge.net/projects/aquaterm/) on Mac or just `brew install gnuplot`)
- invoke `./gc-nvp-trace-processor <tracefile>`

[![sample](http://thlorenz.github.io/v8-profiling/demos/gc-nvp-trace-processor/tracing-gc.txt_0.png)](http://thlorenz.github.io/v8-profiling/demos/gc-nvp-trace-processor/)

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

### grokdump.py

Minidump analyzer.

Shows the processor state at the point of exception including the stack of the active thread and the referenced objects
in the V8 heap. Code objects are disassembled and the addresses linked from the stack (e.g. pushed return addresses) are
marked with "=>".

*I didn't get this to work on Mac - haven't tried on Linux yet* `Warning: Unsupported minidump header magic!`


Needs `objdump`. Install on Mac via:

```
brew install binutils
sudo ln -s $(which gobjdump) /usr/bin/objdump
```

Create a coredump via `gcore <pid>`. Install on Mac via `brew install gcore`.

### lexers-shell.py and parser-shell.py

Tools to benchmark the lexer and parser respectively give a nice insight into how that API works.

### Processing Tick Data

Producing tick data which will be stored in `v8.log` in current directory.

```
node --prof --track_gc_object_stats --trace_gc_verbose --log_timer_events app.js
```

#### tick-processor.html

- open this page in the browser and load a `v8.log` to see the text area populated with processed tick data

#### Command Line

Depending on your operating system use `mac-tick-processor`, `linux-tick-processor` or `freebsd-tick-processor`.

```
mac-tick-processor v8.log > v8.ticks
```

### Plotting tick data

[![profviz](http://thlorenz.github.io/v8-profiling/images/profviz.svg)](http://thlorenz.github.io/v8-profiling/demos/profviz/profviz/profviz.html)


v8 wiki [documentation](https://code.google.com/p/v8/wiki/V8Profiler).

#### In the browser

Do either of the below:

- a) launch the [bleeding edge](http://v8.googlecode.com/svn/branches/bleeding_edge/tools/profviz/profviz.html) or
  [included online profviz instance](http://thlorenz.github.io/v8-profiling/demos/profviz/profviz/profviz.html)
- b) launch a static server in the `./tools` directory. It has to be a server in order to properly serve a needed web
  worker script. Point your browser to `http://localhost:PORT/profviz/profviz.html`  
  
Then follow the instructions to load and then plot a `v8.log` file (by pressing `Start`).

#### From the command line

*Requires gnuplot*

```
./plot-timer-events v8.log
```

If you get this error:

```
gnuplot> set terminal pngcairo size 1600,600 enhanced font 'Helvetica,10'
                      ^
    line 0: unknown or ambiguous terminal type; type just 'set terminal' for a list
```

apply this patch:

```diff
---
 tools/profviz/stdio.js | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

diff --git a/tools/profviz/stdio.js b/tools/profviz/stdio.js
index db38f04..b33b608 100644
--- a/tools/profviz/stdio.js
+++ b/tools/profviz/stdio.js
@@ -51,6 +51,6 @@ function log_error(text) {
 var psc = new PlotScriptComposer(kResX, kResY, log_error);
 psc.collectData(readline, distortion_per_entry);
 psc.findPlotRange(range_start_override, range_end_override);
-print("set terminal pngcairo size " + kResX + "," + kResY +
+print("set terminal png size " + kResX + "," + kResY +
       " enhanced font 'Helvetica,10'");
 psc.assembleOutput(print);
-- 
```

### perf tools 

#### 
Analyses v8 perf logs to produce profiles.
