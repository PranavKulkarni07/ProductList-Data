import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const SearchData = () => {
  const [searchValue, setSearchValue] = useState(""); //Searches Product Data
  const [records, setRecords] = useState([]); //Displays Product Data
  const [selectedValue, setSelectedValue] = useState([]); //Displays Selected Data

  //Fetches Product Data Based on Search Value
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/search", {
        params: { name: searchValue },
      });
      setRecords(response.data);
    } catch (error) {
      console.error("Error in Fetching Data: ", error);
    }
  }, [searchValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //Handles Search Values
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  //Clear Search Value
  const handleClearSearch = () => {
    setSearchValue("");
  };

  //Handles Selection of Records using CheckBox
  const handleBoxChange = (e, id) => {
    const { checked } = e.target;
    if (checked) {
      setSelectedValue([...selectedValue, id]);
    } else {
      setSelectedValue(selectedValue.filter((value) => value !== id));
    }
  };

  //Handles Delete Functionality
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/delete/${id}`);
      // Remove the deleted record from the state
      setRecords(records.filter((record) => record.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  //Renders Search Bar,Table Data
  return (
    <div className="container">
      <h1 style={{ margin: 10 }}>Products</h1>
      <div className="row mb-3">
        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
          <div className="input-group">
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="search-addon"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <button
              className="btn btn-primary btn-sm"
              type="button"
              id="search-addon"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
          <button
            onClick={handleClearSearch}
            className="btn btn-primary btn-sm w-100"
            style={{ color: "white" }}
          >
            Clear Search
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Product</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.name}</td>
                <td>{record.product}</td>
                <td>{record.price}</td>
                <td>{record.quantity}</td>
                <td>
                  <input
                    type="checkbox"
                    onChange={(e) => handleBoxChange(e, record.id)}
                  />
                  {selectedValue.includes(record.id) && (
                    <>
                      <button
                        className="btn btn-danger btn-sm"
                        style={{ marginLeft: "8px", fontSize: "0.75rem" }}
                        onClick={() => handleDelete(record.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchData;
