Game.Rail = {
	SEGMENT_L:		1,
	SEGMENT_R:		2,
	SEGMENT_LT:		4,
	SEGMENT_RT:		8,
	SEGMENT_LB:		16,
	SEGMENT_RB:		32,

	init: function() {
		this.TYPE_NONE = 	0;
		this.TYPE_CROSS_L	= this.SEGMENT_L | this.SEGMENT_RT | this.SEGMENT_RB;
		this.TYPE_CROSS_R	= this.SEGMENT_R | this.SEGMENT_LT | this.SEGMENT_LB;

		this.TYPE_LINE_H	= this.SEGMENT_L | this.SEGMENT_R;
		this.TYPE_LINE_S	= this.SEGMENT_LB | this.SEGMENT_RT;
		this.TYPE_LINE_B	= this.SEGMENT_LT | this.SEGMENT_RB;

		this.TYPE_LINE_HS	= this.TYPE_LINE_H | this.TYPE_LINE_S;
		this.TYPE_LINE_HB	= this.TYPE_LINE_H | this.TYPE_LINE_B;
		this.TYPE_LINE_SB	= this.TYPE_LINE_S | this.TYPE_LINE_B;

		this.TYPE_CORNER_L	= this.SEGMENT_LT | this.SEGMENT_LB;
		this.TYPE_CORNER_RT	= this.SEGMENT_R | this.SEGMENT_LT;
		this.TYPE_CORNER_RB	= this.SEGMENT_R | this.SEGMENT_LB;

		this.TYPE_CORNER_R	= this.SEGMENT_RT | this.SEGMENT_RB;
		this.TYPE_CORNER_LT	= this.SEGMENT_L | this.SEGMENT_RT;
		this.TYPE_CORNER_LB	= this.SEGMENT_L | this.SEGMENT_RB;
	}
};

Game.Rail.init();