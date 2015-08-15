// Code derived from Steve Hobley 2009 - www.stephenhobley.com

#include "PVision.h"

PVision ircam;
byte result;
int xCoord = 0;
int yCoord = 0;
int size = 1;
int counter = 0;

int oldX = 0;
int oldY = 0;
int repeatCounter = 0;

bool init = false;
char coordinates[64];

void same(int x, int y) {
  if (x == oldX && y == oldY) {
    repeatCounter++;
    if (repeatCounter >= 10) {
      init = false;
    }
  } else {
    oldX = x;
    oldY = y;
  }
}

void setup() {
  Serial.begin(38400);
  ircam.init();
  Spark.publish("login");
  delay(1000);
}

void loop() {
  result = ircam.read();
  if (init) counter++;

  if (result & BLOB1) {
    init = true;
    xCoord = ircam.Blob1.X;
    yCoord = ircam.Blob1.Y;
    size = ircam.Blob1.Size;
  }

  /*Serial.print("BLOB1 detected. X:");
  Serial.print(xCoord);
  Serial.print(" Y:");
  Serial.print(yCoord);
  Serial.print(" Size:");
  Serial.println(size);*/

  same(xCoord, yCoord);
  if (init && counter == 23) {
    sprintf(coordinates, "{\"X\": %u, \"Y\": %u, \"Size\": %u}", xCoord, yCoord, size);
    Spark.publish("Coordinates", coordinates);
    counter %= 23;
  }

  delay(50);
}
