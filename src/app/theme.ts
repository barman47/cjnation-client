import { createTheme } from '@mui/material/styles';

export const PRIMARY_COLOR = '#7E57C2';
export const SECONDARY_COLOR = '#1C1C1C';
export const OFF_BLACK = '#605C5C';
export const GREY = '#f6f6f6';
export const DARK_GREY = '#AAAAAA';
export const LIGHT_GREY = 'rgba(0, 0, 0, 0.12)';
export const WHITE = '#FFFFFF';
export const TEXT_COLOR = '#636363';
export const LINK_COLOR = '#2973b7';

export const theme = createTheme({
	components: {
		MuiButton: {
			defaultProps: {
				disableElevation: true,
				disableRipple: true,
				disableFocusRipple: true,
				disableTouchRipple: true
			},
			styleOverrides: {
				root: {
                    color: '#FCFCFC',
					borderRadius: '50px',
					textTransform: 'none',
					paddingBottom: '10px',
					paddingTop: '10px'
				},

				outlined: {
					color: PRIMARY_COLOR
				},

				text: {
					color: PRIMARY_COLOR
				}
			}
		},

		MuiOutlinedInput: {
			styleOverrides: {
				root:{
					backgroundColor: GREY,
					borderRadius: '15px'
					// paddingBottom: '1px',
					// paddingTop: '1px',

				},
				notchedOutline: {
					border: `2px solid transparent`,
					
				},
				input: {
					'&:focus': {
						bordercColor: PRIMARY_COLOR,
					}
				}
			}
		}
	},
	
	palette: {
		primary: {
			// light: '#338080',
			main: PRIMARY_COLOR,
			// dark: '#990300'
		},

		secondary: {
			main: SECONDARY_COLOR
		},

		text: {
			// primary: '#f8f8f8',
			// secondary: '#f8f8f8'
		}
	},

	shape: {
		borderRadius: 12
	},

	breakpoints: {
		values: {
			xs: 0,     // Up to 480px
			sm: 481,   // 481px to 767px
			md: 769,   // 768px to 1023px
			lg: 1025,  // 1024px to 1279px
			xl: 1281   // 1280px and above
		}
	},

	typography: {
		fontFamily: 'inherit',
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
		// fontWeightBold: 600,
		fontWeightBold: 700,

	}
});