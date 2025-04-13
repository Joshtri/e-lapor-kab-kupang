import { Table, Button, Tooltip } from 'flowbite-react';

export default function TableRenderer({ data, columnConfig, actions }) {
  return (
    <Table striped>
      <Table.Head>
        {columnConfig.map((col) => (
          <Table.HeadCell key={col.key} className={col.className}>
            {col.label}
          </Table.HeadCell>
        ))}
        {actions.length > 0 && (
          <Table.HeadCell className="text-center">Aksi</Table.HeadCell>
        )}
      </Table.Head>

      <Table.Body>
        {data.map((item) => (
          <Table.Row key={item.id}>
            {columnConfig.map((col) => (
              <Table.Cell key={col.key}>
                {col.render ? col.render(item[col.key], item) : item[col.key]}
              </Table.Cell>
            ))}
            {actions.length > 0 && (
              <Table.Cell>
                <div className="flex items-center gap-2">
                  {actions.map((action, i) => (
                    <Tooltip key={i} content={action.label}>
                      <Button
                        size="xs"
                        color="gray"
                        className="p-2"
                        onClick={() => action.onClick(item)}
                      >
                        {action.icon}
                      </Button>
                    </Tooltip>
                  ))}
                </div>
              </Table.Cell>
            )}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
