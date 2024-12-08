import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios';
import inventoryStateMap from '../Helpers/InventoryStateMap';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  CircularProgress,
} from '@mui/material';

const TableComponent = ({ organizationId }) => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    type: '',
    state: 'Good', // Default state
  });
  const [openDialog, setOpenDialog] = useState(false); // State to control the dialog

  // States for search and dropdown filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterState, setFilterState] = useState('');

  // Fetch data from the API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`organizations/${organizationId}/inventory`);
        setItems(response.data);
      } catch (err) {
        setError('Failed to fetch inventory items.', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [organizationId]);

  // Toggle checkbox selection for a specific item
  const handleCheckboxToggle = (itemId) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(itemId)
        ? prevSelectedItems.filter((id) => id !== itemId)
        : [...prevSelectedItems, itemId]
    );
  };

  // Handle selecting all checkboxes
  const handleSelectAllCheckbox = (event) => {
    if (event.target.checked) {
      setSelectedItems(items.map((item) => item.id)); // Select all items
    } else {
      setSelectedItems([]); // Deselect all items
    }
  };

  // Check if all checkboxes are selected
  const isAllSelected = items.length > 0 && selectedItems.length === items.length;

  // Handle form input changes for the new item
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddItem = async () => {
    try {
      const response = await axiosInstance.post(
        `organizations/${organizationId}/inventory`,
        {
          name: newItem.name,
          type: newItem.type,
          inventoryState: newItem.state,
        }
      );
      console.log('Item added:', response.data);
      setItems((prevItems) => [...prevItems, response.data]);
      setNewItem({ name: '', type: '', state: 'Good' });
      setOpenDialog(false); // Close the dialog after adding the item
    } catch (err) {
      if (err.response) {
        console.error('Error Response:', err.response.data);
        setError('Failed to add item: ' + err.response.data.error);
      } else {
        setError('Failed to add item: ' + err.message);
      }
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false); // Close the dialog without adding an item
  };

  // Filtering logic for search and dropdowns
  const filteredItems = items.filter((item) => {
    const matchesSearchTerm =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toString().includes(searchTerm);
    const matchesType = filterType ? item.type === filterType : true;
    const matchesState = filterState ? item.state === filterState : true;

    return matchesSearchTerm && matchesType && matchesState;
  });

  return (
    <div>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
        <Typography variant="h4" component="h1">
          Inventory items
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)} // Open the dialog when clicked
        >
          + ADD
        </Button>
      </Box>

      {/* Filter Section (Left-aligned horizontally) */}
      <Box marginBottom={3} display="flex" alignItems="center" flexWrap="wrap">
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px', minWidth: 220 }}
        />
        <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            label="Type"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="Type 1">Primary</MenuItem>
            <MenuItem value="Type 2">String</MenuItem>
            {/* Add more types as per your requirements */}
          </Select>
        </FormControl>
        <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: 150 }}>
          <InputLabel>State</InputLabel>
          <Select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            label="State"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {Object.keys(inventoryStateMap).map((key) => (
              <MenuItem key={key} value={key}>
                {inventoryStateMap[key]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Dialog for Adding a New Item */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Type"
                variant="outlined"
                fullWidth
                name="type"
                value={newItem.type}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="State"
                variant="outlined"
                fullWidth
                name="state"
                value={newItem.state}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            color="primary"
            sx={{
              color: 'primary.main', // Blue text color
              backgroundColor: 'white', // White background
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 255, 0.08)', // Optional: slightly darker background on hover
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddItem}
            color="primary"
            sx={{
              color: 'white', // White text
              backgroundColor: 'primary.main', // Blue background
              '&:hover': {
                backgroundColor: 'primary.dark', // Darker blue background on hover
              },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table Container with Full Width */}
      <TableContainer component={Paper} sx={{ width: '100%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <CircularProgress />
          </div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <Table sx={{ width: '100%' }} aria-label="items table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={isAllSelected}
                    onChange={handleSelectAllCheckbox}
                    color="primary"
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>State</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxToggle(item.id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.creationDate}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        padding: '5px 10px',
                        borderRadius: '4px',
                      }}
                    >
                      {inventoryStateMap[item.state]} {/* Dynamically map numeric state */}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </div>
  );
};

export default TableComponent;
