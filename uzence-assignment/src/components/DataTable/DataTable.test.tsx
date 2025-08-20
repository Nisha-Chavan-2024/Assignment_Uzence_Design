import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import userEvent from '@testing-library/user-event';
// import DataTable, { Column } from '../../components/DataTable';
import DataTable from './DataTable';
import type { Column } from './DataTable';



type Row = { name: string; age: number; email: string };

const data: Row[] = [
  { name: 'Bob', age: 34, email: 'b@example.com' },
  { name: 'Alice', age: 29, email: 'a@example.com' },
  { name: 'Carol', age: 22, email: 'c@example.com' },
];

const columns: Column<Row>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email' },
];

describe('DataTable', () => {
  it('renders headers and rows', () => {
    render(<DataTable<Row> data={data} columns={columns} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('sorts by a sortable column when header clicked', async () => {
    const user = userEvent.setup();
    render(<DataTable<Row> data={data} columns={columns} />);

    const ageHeaderBtn = screen.getByRole('button', { name: /sort by age/i });
    await user.click(ageHeaderBtn); // asc

    const cells = screen.getAllByRole('cell'); 
    expect(cells[0]).toHaveTextContent('Carol');

    await user.click(ageHeaderBtn); // desc
    const cells2 = screen.getAllByRole('cell');
    expect(cells2[0]).toHaveTextContent('Bob');
  });

  it('supports selecting rows and calls onRowSelect', async () => {
    const user = userEvent.setup();
    const onRowSelect = vi.fn();
    render(<DataTable<Row> data={data} columns={columns} selectable onRowSelect={onRowSelect} />);

    // Click first row checkbox
    const cb1 = screen.getByLabelText(/select row 1/i);
    await user.click(cb1);
    expect(onRowSelect).toHaveBeenLastCalledWith([data[0]]);

    const row2 = screen.getAllByRole('row')[2]; // [0] header, [1] row1, [2] row2
    await user.click(row2);
    expect(onRowSelect).toHaveBeenLastCalledWith([data[1]]);
  });

  it('shows loading and empty states', () => {
    const { rerender } = render(<DataTable<Row> data={data} columns={columns} loading />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    rerender(<DataTable<Row> data={[]} columns={columns} />);
    expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
  });
});
