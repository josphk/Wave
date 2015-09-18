// Example of using the PVision library for interaction with the Pixart sensor on a WiiMote
// This work was derived from Kako's excellent Japanese website
// http://www.kako.com/neta/2007-001/2007-001.html

// Steve Hobley 2009 - www.stephenhobley.com
/******************************************************************************
* Includes
******************************************************************************/
#include "PVision.h"

/******************************************************************************
* Private methods
******************************************************************************/
void PVision::Write_2bytes(byte d1, byte d2) {
    Wire.beginTransmission(IRslaveAddress);
    Wire.write(d1); Wire.write(d2);
    Wire.endTransmission();
}


/******************************************************************************
* Constructor
******************************************************************************/
PVision::PVision() {
	Blob1.number = 1;
}

/******************************************************************************
* Public methods
******************************************************************************/
// init the PVision sensor
void PVision::init () {
    IRsensorAddress = 0xB0;
    IRslaveAddress = IRsensorAddress >> 1;   // This results in 0x21 as the address to pass to TWI

    Wire.begin();
    // IR sensor initialize
    Write_2bytes(0x30,0x01); delay(10);
    Write_2bytes(0x30,0x08); delay(10);
    Write_2bytes(0x06,0x90); delay(10);
    Write_2bytes(0x08,0xC0); delay(10);
    Write_2bytes(0x1A,0x40); delay(10);
    Write_2bytes(0x33,0x33); delay(10);
    delay(100);

    Serial.println("Initiating...");
}

byte PVision::read() {
    //IR sensor read
    Wire.beginTransmission(IRslaveAddress);
    Wire.write(0x36);
    Wire.endTransmission();

    Wire.requestFrom(IRslaveAddress, 16);        // Request the 2 byte heading (MSB comes first)
    for (i=0; i<16; i++) {
       data_buf[i]=0;
    }

    i=0;

    while(Wire.available() && i < 16) {
        data_buf[i] = Wire.read();
        i++;
    }

    blobcount = 0;

    Blob1.X = data_buf[1];
    Blob1.Y = data_buf[2];
    s   = data_buf[3];
    Blob1.X += (s & 0x30) <<4;
    Blob1.Y += (s & 0xC0) <<2;
    Blob1.Size = (s & 0x0F);

    blobcount |= (Blob1.Size < 15)? BLOB1 : 0;

    return blobcount;
}
