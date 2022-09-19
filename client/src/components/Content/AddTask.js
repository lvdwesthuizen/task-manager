/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BsCalendar2Plus } from 'react-icons/bs';

export default function AddTask(props) {
	const [date, setDate] = useState(null);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	return (
		<Box>
			<Box
				sx={{
					border: '1px solid #CCC',
					borderRadius: '8px',
					backgroundColor: '#FFF',
					p: '12px',
				}}
			>
				<input
					autoFocus
					type='text'
					placeholder='Title'
					className='form-field-no-border'
					onChange={e => setTitle(e.target.value)}
				/>
				<textarea
					type='text'
					placeholder='Description'
					className='form-field-no-border'
					onKeyUp={e => props.handleTextAreaHeight(e.target.scrollHeight)}
					style={{
						width: '100%',
						overflow: 'hidden',
						height: props.inputHeight,
					}}
					onChange={e => setDescription(e.target.value)}
				/>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						inputFormat='dd/MM/yyyy'
						label='Due date'
						value={date}
						onChange={newValue => {
							setDate(newValue);
						}}
						components={{
							OpenPickerIcon: BsCalendar2Plus,
						}}
						renderInput={({ inputRef, inputProps, InputProps }) => (
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									flexDirection: 'row-reverse',
									'& button': {
										'&:hover': {
											backgroundColor: 'none',
										},
									},
									'& svg': {
										fontSize: '18px',
									},
								}}
							>
								<input
									ref={inputRef}
									{...inputProps}
									style={{
										border: 'none',
										outline: 'none',
										color: '#767676',
										marginLeft: '13px',
									}}
								/>
								{InputProps?.endAdornment}
							</Box>
						)}
					/>
				</LocalizationProvider>
			</Box>
			<Box
				className='flex-row'
				size='small'
				sx={{ justifyContent: 'flex-end', mt: 1 }}
			>
				<Button onClick={props.handleClose}>Cancel</Button>
				<Button
					variant='contained'
					size='small'
					sx={{ ml: 1 }}
					disabled={title === '' || description === ''}
					onClick={() => props.handleAddTask(date, title, description)}
				>
					Add task
				</Button>
			</Box>
		</Box>
	);
}
