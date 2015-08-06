// Example of using the PVision library for interaction with the Pixart sensor on a WiiMote
// This work was derived from Kako's excellent Japanese website
// http://www.kako.com/neta/2007-001/2007-001.html

// Steve Hobley 2009 - www.stephenhobley.com

#include "PVision.h"

PVision ircam;
byte result;
int xCoord = 0;
int yCoord = 0;
int counter = 0;
char coordinates[64];

void setup()
{
  Serial.begin(38400);
  ircam.init();
}

void loop()
{

  /*Serial.println("Publishing...");
  for(int i = 0; i < 10; i++) {
    Spark.publish("Interfacer", String(i));
    delay(2000);
  }
  delay(1000);*/
  result = ircam.read();
  counter++;

  if (result & BLOB1) {
    /*Serial.print(" Size:");
    Serial.println(ircam.Blob1.Size);*/
    xCoord = ircam.Blob1.X;
    yCoord = ircam.Blob1.Y;
  }

  Serial.print("BLOB1 detected. X:");
  Serial.print(xCoord);
  Serial.print(" Y:");
  Serial.println(yCoord);

  if (counter == 23) {
    sprintf(coordinates, "{\"X\": %u, \"Y\": %u}", xCoord, yCoord);
    Spark.publish("Coordinates", coordinates);
    counter %= 23;
  }

/*
  if (result & BLOB2)
  {
    Serial.print("BLOB2 detected. X:");
    Serial.print(ircam.Blob2.X);
    Serial.print(" Y:");
    Serial.print(ircam.Blob2.Y);
    Serial.print(" Size:");
    Serial.println(ircam.Blob2.Size);
  }
  if (result & BLOB3)
  {
    Serial.print("BLOB3 detected. X:");
    Serial.print(ircam.Blob3.X);
    Serial.print(" Y:");
    Serial.print(ircam.Blob3.Y);
    Serial.print(" Size:");
    Serial.println(ircam.Blob3.Size);
  }
  if (result & BLOB4)
  {
    Serial.print("BLOB4 detected. X:");
    Serial.print(ircam.Blob4.X);
    Serial.print(" Y:");
    Serial.print(ircam.Blob4.Y);
    Serial.print(" Size:");
    Serial.println(ircam.Blob4.Size);
  }*/

  // Short delay...
  delay(50);
}
