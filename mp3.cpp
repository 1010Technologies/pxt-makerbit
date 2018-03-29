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
    void readResponse(int tx, int rx, int baud) {
      MicroBitPin* txp = getPin((int)tx); if (!txp) return;
      MicroBitPin* rxp = getPin((int)rx); if (!rxp) return;
      uBit.serial.redirect(txp->name, rxp->name);
      uBit.serial.baud(baud);

      // Enforce initialization of serial RX buffers to prevent hang
      uBit.serial.read(MicroBitSerialMode::ASYNC);
    }
}
