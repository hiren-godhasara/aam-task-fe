import { Group } from '../../types';
import { ColumnHeader } from '../Column/ColumnHeader';
import { TableRow } from '../Row/TableRow';
import { AddRowButton } from '../Row/AddRowButton';

interface GroupTableProps {
  group: Group;
}

export const GroupTable: React.FC<GroupTableProps> = ({ group }) => {
  if (group.isCollapsed) {
    return null;
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm border-l border-r border-b border-white/20 rounded-2xl mt-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="group">
              {group?.columns.map((column: typeof group.columns[number]) => (
                <ColumnHeader
                  key={column.id}
                  column={column}
                  groupId={group.id}
                />
              ))}
              <th className="w-16 px-4 py-4 bg-slate-50/80"></th>
            </tr>
          </thead>
          <tbody>
            {group.rows.map((row: typeof group.rows[number], index: number) => (
              <TableRow
                key={row.id}
                row={row}
                columns={group.columns}
                groupId={group.id}
                isEven={index % 2 === 0}
              />
            ))}
            <AddRowButton
              groupId={group.id}
              colSpan={group.columns.length + 1}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};