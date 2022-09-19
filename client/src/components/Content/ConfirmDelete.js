/* eslint-disable react/prop-types */
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { BsInfoCircle } from 'react-icons/bs';

export default function ConfirmDelete(props) {
	return (
		<Dialog
			open={props.open}
			onClose={props.handleClose}
			PaperProps={{
				elevation: 0,
				sx: { width: '30%', borderRadius: '16px' },
			}}
		>
			<DialogContent>
				<Typography
					variant='body1'
					sx={{ display: 'flex', alignItems: 'center' }}
				>
					<BsInfoCircle size={18} style={{ marginRight: '8px' }} />
					Are you sure you want to delete{' '}
					<span style={{ fontWeight: 500, marginLeft: '4px' }}>
						{props.item.name}
					</span>
					?
				</Typography>
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
					onClick={() => props.handleDelete(props.item._id)}
				>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
}
