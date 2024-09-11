import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { Typography, Box, MenuItem, FormControl, Select, InputLabel, List, ListItem, Checkbox, ListItemText } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getStatesAndCities } from "../utils/schoolDataHelper";

const SearchSchools = () => {
    const [schoolList, setSchoolList] = useState([]);
    const [message, setMessage] = useState("Welcome! Start your search for partner schools by selecting a state and city.");

    const statesData = getStatesAndCities(); // Get the states and cities from the utility

    const fetchSchools = async (state, city) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/affiliated-schools/search-schools`, {
                state: state || '',
                city: city || ''
            });

            return response.data.schools || [];
        } catch (error) {
            console.error("Error fetching schools: ", error);
            return [];
        }
    };

    const formik = useFormik({
        initialValues: {
            state: "",
            city: ""
        },
        onSubmit: (values) => {
        }
    });

    // Trigger search whenever state or city changes
    useEffect(() => {
        const fetchData = async () => {
            if (formik.values.state || formik.values.city) {
                const schools = await fetchSchools(formik.values.state, formik.values.city);
                if (schools.length === 0) {
                    setSchoolList([]);
                    setMessage("No schools found in the selected state and city. We're working on adding more schools. Stay tuned!");
                } else {
                    setSchoolList(schools);
                    setMessage("");
                }
            } else {
                setSchoolList([]);
                setMessage("Welcome! Start your search for partner schools by selecting a state and city.");
            }
        };

        fetchData();
    }, [formik.values.state, formik.values.city]);

    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        formik.setFieldValue("state", selectedState);
        formik.setFieldValue("city", ""); // Reset city when state changes
    };

    const handleCityChange = (e) => {
        formik.setFieldValue("city", e.target.value);
    };

    const selectedState = formik.values.state;
    const cities = statesData.find((state) => state.label === selectedState)?.districts || [];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: "100%", maxHeight: "100vh", margin: "0 auto" }}>
            {/* Form Section */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 3, paddingTop: "2rem", backgroundColor: "transparent" }}>
                <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", fontSize: "1.75rem", color: "#3f51b5" }}>
                    6000+ Partner Schools...
                </Typography>

                {/* Form */}
                <form onSubmit={formik.handleSubmit}>
                    {/* State selection */}
                    <FormControl sx={{ marginBottom: 2, marginRight: 2, width: "45%" }}>
                        <InputLabel>Select State</InputLabel>
                        <Select
                            id="state"
                            name="state"
                            value={formik.values.state}
                            label="Select State"
                            onChange={handleStateChange}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderRadius: "20px" },
                                    "&:hover fieldset": { borderColor: "grey !important" },
                                    "&.Mui-focused fieldset": { borderColor: "grey !important" }
                                },
                            }}
                        >
                            {statesData.map((state, index) => (
                                <MenuItem key={index} value={state.label}>
                                    {state.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* City selection */}
                    <FormControl sx={{ width: "45%", marginBottom: 2 }}>
                        <InputLabel>Select City</InputLabel>
                        <Select
                            id="city"
                            name="city"
                            value={formik.values.city}
                            label="Select City"
                            onChange={handleCityChange}
                            disabled={!formik.values.state}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderRadius: "8px" },
                                    "&:hover fieldset": { borderColor: "grey !important" },
                                    "&.Mui-focused fieldset": { borderColor: "grey !important" }
                                },
                            }}
                        >
                            {cities.map((city, index) => (
                                <MenuItem key={index} value={city.label}>
                                    {city.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </form>
            </Box>

            {/* School List Section */}
            <Box sx={{ padding: 2, paddingTop: 0, height: "auto", backgroundColor: "#fff", overflowY: "auto", position: "relative" }}>
                <Typography
                    variant="h6"
                    align="center"
                    gutterBottom
                    sx={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#fff",
                        zIndex: 1,
                        py: 2,
                        fontWeight: "bold",
                        fontSize: "1.25rem",
                        color: "#3f51b5",
                        borderBottom: "2px solid #3f51b5",
                    }}
                >
                    Partner Schools
                </Typography>

                {/* Display message or school list */}
                {schoolList.length > 0 ? (
                    <List>
                        {schoolList.map((school, index) => (
                            <ListItem key={index} divider>
                                <Checkbox
                                    icon={<CheckCircleIcon />}
                                    checkedIcon={<CheckCircleIcon color="success" />}
                                    edge="start"
                                    checked={true}
                                    disableRipple
                                />
                                <ListItemText
                                    primary={school.schoolName}
                                    secondary={
                                        <Typography variant="body2" color="textSecondary">
                                            {school.affiliationId}
                                        </Typography>
                                    }
                                    sx={{ marginLeft: 1 }}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography align="center" sx={{ marginTop: 2 }}>
                        {message}
                    </Typography>
                )}
            </Box>
        </Box >
    );
};

export default SearchSchools;
