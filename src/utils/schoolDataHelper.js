// Import the JSON data
import schoolData from "../data/affiliatedSchoolsData.json";

// Define and export the function to get states and cities
export const getStatesAndCities = () => {
  return schoolData.states.map((state) => ({
    label: state.state,
    districts: state.districts.map((district) => ({ label: district })),
  }));
};
