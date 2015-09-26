// Library derived from Steve Hobley and Kako

#ifndef PVision_h
#define PVision_h

#include "application.h"

#define POINT 0x01

struct Blob {
   	int X;
   	int Y;
   	int Size;
   	byte number;
};

class PVision {

public:
  PVision();

	void init();
	byte read();

	Blob Point;

private:
	int IRsensorAddress;
	int IRslaveAddress;
	byte data_buf[16];
	int i;
	int s;

	void Write_2bytes(byte d1, byte d2);
	byte pointCount;

};

#endif
