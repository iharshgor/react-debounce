import { useEffect, useState } from 'react';
import './App.css';
import useDebounce from './hook/useDebounce';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


function App() {
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	useEffect(
		() => {
			if (debouncedSearchTerm) {
				setLoading(true);
				fetch(`https://api.github.com/search/users?q=${debouncedSearchTerm}`)
					.then(res => res.json())
					.then(data => {
						setLoading(false);
						setSearchResults(data.items);
					});
			} else {
				setSearchResults([]);
			}
		},
		[debouncedSearchTerm] // Only call effect if debounced search term changes
	);

	return (
		<div className="App">
			<Box
				component="form"
				sx={{
					'& > :not(style)': { m: 1 },
				}}
				noValidate
				autoComplete="off"
			>
				<TextField
					label="Search Github Users"
					variant="outlined"
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				{loading && <div>Searching...</div>}
				{searchResults.map(item => {
					return (
						<div>
							<a href={item.html_url} target="_blank" rel="noreferrer">{item.login}</a>
						</div>
					);
				})}
			</Box>
		</div>
	);
}

export default App;
