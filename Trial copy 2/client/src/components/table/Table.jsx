import React from "react";
import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";

const TableComponent = ({ transactions, totalPages, currentPage, onPageChange }) => {
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="transaction table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Post ID</TableCell>
            <TableCell className="tableCell">Agent Name</TableCell>
            <TableCell className="tableCell">Buyer Name</TableCell>
            <TableCell className="tableCell">Location</TableCell>
            <TableCell className="tableCell">Buying Time</TableCell>
            <TableCell className="tableCell">Buying Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="tableCell">{transaction.post.id}</TableCell>
              <TableCell className="tableCell">
                {/* Get the Agent Name from the user who posted the transaction */}
                {transaction.post.user ? transaction.post.user.username : "N/A"}
              </TableCell>
              <TableCell className="tableCell">
                {/* Check if buyer exists before accessing 'username' */}
                {transaction.buyer ? transaction.buyer.username : "N/A"}
              </TableCell>
              <TableCell className="tableCell">{transaction.post.city}</TableCell>
              <TableCell className="tableCell">{new Date(transaction.transactionDate).toLocaleTimeString()}</TableCell>
              <TableCell className="tableCell">{new Date(transaction.transactionDate).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={totalPages * 5} // This will set the total item count (5 * totalPages)
        rowsPerPage={5}
        page={currentPage - 1}
        onPageChange={(event, newPage) => onPageChange(newPage + 1)} // +1 because the API is 1-based
        labelRowsPerPage="Rows per page"
      />
    </TableContainer>
  );
};

export default TableComponent;
