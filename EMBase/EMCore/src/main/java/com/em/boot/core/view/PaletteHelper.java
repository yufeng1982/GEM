package com.em.boot.core.view;

public class PaletteHelper {

	private short colorIndex;
	private byte r;
	private byte g;
	private byte b;
	
	public PaletteHelper(short colorIndex, byte r, byte g, byte b) {
		this.colorIndex = colorIndex;
		this.r = r;
		this.g = g;
		this.b = b;
	}
	
	public short getColorIndex() {
		return colorIndex;
	}
	public void setColorIndex(short colorIndex) {
		this.colorIndex = colorIndex;
	}
	public byte getR() {
		return r;
	}
	public void setR(byte r) {
		this.r = r;
	}
	public byte getG() {
		return g;
	}
	public void setG(byte g) {
		this.g = g;
	}
	public byte getB() {
		return b;
	}
	public void setB(byte b) {
		this.b = b;
	}
}
