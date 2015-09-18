// PVision library for interaction with the Pixart sensor on a WiiMote
// This work was derived from Kako's excellent Japanese website
// http://www.kako.com/neta/2007-001/2007-001.html

// Steve Hobley 2009 - www.stephenhobley.com

#ifndef PVision_h
#define PVision_h

#include "application.h"

// bit flags for blob
#define BLOB1 0x01

// Returned structure from a call to readSample()
struct Blob {
   	int X;
   	int Y;
   	int Size;
   	byte number;
};

class PVision {

public:
  PVision();

	void init();   // returns true if the connection to the sensor established correctly
	byte read();   // updated the blobs, and returns the number of blobs detected

	// Make these public
	Blob Blob1;

private:
  	// per object data
	int IRsensorAddress;
	int IRslaveAddress;
	byte data_buf[16];
	int i;
	int s;

	void Write_2bytes(byte d1, byte d2);
	byte blobcount; // returns the number of blobs found - reads the sensor

};

#endif
