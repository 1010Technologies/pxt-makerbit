#include "pxt.h"

using namespace pxt;

namespace makerbit {
    //%
    void redirectSerial(int tx, int rx, int baud) {
      MicroBitPin* txp = getPin((int)tx); if (!txp) return;
      MicroBitPin* rxp = getPin((int)rx); if (!rxp) return;
      uBit.serial.redirect(txp->name, rxp->name);
      uBit.serial.baud(baud);

      // Enforce initialization of serial RX buffers to prevent hang
      uBit.serial.read(MicroBitSerialMode::ASYNC);
    }

    //%
    int readSerialToBuffer(Buffer buffer) {
       // This code is required to support MakerBit during MakeCode Beta phase in both Beta and production environment.
#ifdef MICROBIT_MANAGED_BUFFER_H
      // The current version of MakeCode uses ManagedBuffer (2018-08-25)
      return uBit.serial.read(buffer->payload, buffer->length);
#else
      // The next version of MakeCode used BoxedBuffer
      return uBit.serial.read(buffer->data, buffer->length);
#endif
    }
}
