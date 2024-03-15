import * as PIXI from 'pixi.js';
import TargetedAction from './TargetedAction';
import Interpolation from '../Interpolation';
import Interpolations from '../Interpolations';

export default class TintTo extends TargetedAction {
	interpolation: Interpolation;
	tintableTarget: PIXI.Sprite | PIXI.BitmapText | PIXI.Graphics | PIXI.Mesh = null;
	startTint: PIXI.Color;
	tint: PIXI.Color;
	currentTint = new PIXI.Color();
	
	constructor(
		target: PIXI.DisplayObject,
		tint: number, 
		seconds: number, 
		interpolation: Interpolation = Interpolations.linear)
	{
		super(target, seconds);
		this.interpolation = interpolation;
		this.tint = new PIXI.Color(tint);
		
		if (this.target instanceof PIXI.Sprite) {
			this.tintableTarget = this.target;
		}
	}
	
	tick(delta: number): boolean {
		if (! this.tintableTarget) {
			return true;
		}

		if (this.time === 0) {
			this.startTint = new PIXI.Color(this.tintableTarget.tint);
		}
		
		this.time += delta;
		
		const factor: number = this.interpolation(this.timeDistance);

		this.currentTint.setValue([
			this.startTint.red + (this.tint.red - this.startTint.red) * factor,
			this.startTint.green + (this.tint.green - this.startTint.green) * factor,
			this.startTint.blue + (this.tint.blue - this.startTint.blue) * factor
		]);
		this.tintableTarget.tint = this.currentTint;
		return this.timeDistance >= 1;
	}
	
	reset() {
		super.reset();
		this.time = 0;
		return this;
	}
};