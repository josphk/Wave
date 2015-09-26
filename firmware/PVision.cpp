// Library derived from Steve Hobley and Kako

#include "PVision.h"

void PVision::Write_2bytes(byte d1, byte d2) {
    Wire.beginTransmission(IRslaveAddress);
    Wire.write(d1); Wire.write(d2);
    Wire.endTransmission();
}

PVision::PVision() {
	Point.number = 1;
}

void PVision::init () {
    IRsensorAddress = 0xB0;
    IRslaveAddress = IRsensorAddress >> 1;

    Wire.begin();

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
    Wire.beginTransmission(IRslaveAddress);
    Wire.write(0x36);
    Wire.endTransmission();

    Wire.requestFrom(IRslaveAddress, 16);
    for (i=0; i<16; i++) {
       data_buf[i]=0;
    }

    i=0;

    while(Wire.available() && i < 16) {
        data_buf[i] = Wire.read();
        i++;
    }

    pointCount = 0;

    Point.X = data_buf[1];
    Point.Y = data_buf[2];
    s = data_buf[3];
    Point.X += (s & 0x30) <<4;
    Point.Y += (s & 0xC0) <<2;
    Point.Size = (s & 0x0F);

    pointCount |= (Point.Size < 15)? POINT : 0;

    return pointCount;
}
