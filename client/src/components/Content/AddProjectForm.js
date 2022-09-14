/* eslint-disable react/prop-types */
import React, { useReducer } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { BsFillRecordFill } from 'react-icons/bs';
import { Typography } from '@mui/material';
import { useEffect } from 'react';

const colours = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black'];

const initialState = {
	name: '',
	colour: 'black',
	view: 'list',
};

function reducer(state, action) {
	switch (action.type) {
		case 'updateField':
			return {
				...state,
				[action.field]: action.value,
			};
		case 'reset':
			return initialState;
		case 'edit':
			return action.data;
		default:
			return state;
	}
}

export default function AddProjectForm(props) {
	const [state, dispatch] = useReducer(reducer, initialState);
	useEffect(() => {
		dispatch({ type: 'reset' });
	}, [props.open, props.project]);

	return (
		<Dialog
			open={props.open}
			onClose={props.handleClose}
			PaperProps={{
				elevation: 0,
				sx: { width: '30%', borderRadius: '16px' },
			}}
		>
			<DialogTitle>{props.type} Project</DialogTitle>
			<DialogContent>
				<Box mb={2}>
					<label className='input-label'>Name</label>
					<TextField
						size='small'
						value={props.project.name || state.name}
						onChange={e =>
							dispatch({
								type: 'updateField',
								field: 'name',
								value: e.target.value,
							})
						}
						fullWidth
					/>
				</Box>
				<Box>
					<label className='input-label'>Colour</label>
					<Select
						size='small'
						fullWidth
						displayEmpty
						value={props.project.colour || state.colour}
						onChange={e =>
							dispatch({
								type: 'updateField',
								field: 'colour',
								value: e.target.value,
							})
						}
					>
						{colours.map(item => (
							<MenuItem
								key={item}
								value={item}
								sx={{ display: 'flex', alignItems: 'center' }}
							>
								<BsFillRecordFill size={18} color={item} />
								<Typography
									variant='body1'
									ml={1}
									sx={{ textTransform: 'capitalize' }}
								>
									{item}
								</Typography>
							</MenuItem>
						))}
					</Select>
				</Box>
				<FormControl sx={{ mt: '20px' }}>
					<label className='input-label'>View</label>
					<RadioGroup
						value={props.project.view || state.view}
						sx={{ flexDirection: 'row' }}
						onChange={e =>
							dispatch({
								type: 'updateField',
								field: 'view',
								value: e.target.value,
							})
						}
					>
						<FormControlLabel value='list' control={<Radio />} label='List' />
						<FormControlLabel value='board' control={<Radio />} label='Board' />
					</RadioGroup>
				</FormControl>
			</DialogContent>
			<DialogActions sx={{ padding: '0 16px 12px' }}>
				<Button
					variant='contained'
					color='cancel'
					disableElevation
					onClick={props.handleClose}
				>
					Cancel
				</Button>
				<Button
					variant='contained'
					disableElevation
					disabled={!state.name}
					onClick={() => props.handleAddProject(state)}
				>
					Add
				</Button>
			</DialogActions>
		</Dialog>
	);
}
