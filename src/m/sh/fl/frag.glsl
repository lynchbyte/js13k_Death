varying vec2 vUv;

void main()
{
float st =  distance(vUv, vec2(0.5));


gl_FragColor = vec4(0.06,0.06,0.09, 1.6 - exp( st));
	
}

