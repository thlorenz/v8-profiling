#include <ctype.h>

#include "v8.h"

#include "cctest.h"
#include "../include/v8-profiler.h"

/* Only using public API */

class FileOutputStream: public v8::OutputStream {
public:
  FileOutputStream(FILE* stream): stream_(stream) {
  }

  virtual int GetChunkSize() {
    return 65536;
  }

  virtual void EndOfStream() {
  }

  virtual WriteResult WriteAsciiChunk(char* data, int size) {
    const size_t len = static_cast<size_t>(size);
    size_t off = 0;

    while (off < len && !feof(stream_) && !ferror(stream_))
      off += fwrite(data + off, 1, len - off, stream_);

    return off == len ? kContinue : kAbort;
  }

private:
  FILE* stream_;
};

TEST(PrintHeapSnapshot) {
  LocalContext env2;
  v8::HandleScope scope(env2->GetIsolate());
  v8::HeapProfiler* heap_profiler = env2->GetIsolate()->GetHeapProfiler();

  CompileRun(
      "function A2() {}\n"
      "var a = new A2();\n"
  );
  const v8::HeapSnapshot* snap_env2 = heap_profiler->TakeHeapSnapshot(v8_str("env2"));

  /* Print to console */
  FileOutputStream out(stderr);
  snap_env2->Serialize(&out, v8::HeapSnapshot::kJSON);
}

TEST(SaveHeapSnapshot) {
  LocalContext env2;
  v8::HandleScope scope(env2->GetIsolate());
  v8::HeapProfiler* heap_profiler = env2->GetIsolate()->GetHeapProfiler();

  CompileRun(
      "function A2() {}\n"
      "function B2(x) { return function() { return typeof x; }; }\n"
      "function C2(x) { this.x1 = x; this.x2 = x; this[1] = x; }\n"
      "var a2 = new A2();\n"
      "var b2_1 = new B2(a2), b2_2 = new B2(a2);\n"
      "var c2 = new C2(a2);");
  
  const v8::HeapSnapshot* snap_env2 = heap_profiler->TakeHeapSnapshot(v8_str("env2"));

  /* Save to `pwd`/test-profilers-heap_save-snapshot.heapsnapshot */
  const char* filename = "test-profilers-heap_save-snapshot.heapsnapshot";
  FILE* fp = fopen(filename, "w");
  FileOutputStream out(fp);
  snap_env2->Serialize(&out, v8::HeapSnapshot::kJSON);
  fclose(fp);
}