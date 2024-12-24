/* eslint-disable react/prop-types */
import {Table} from "flowbite-react";

const DataTable = ({headers, data}) => {
    return (<Table hoverable>
        <Table.Head className="uppercase">
            {headers.map((field, index) => (<Table.HeadCell key={index}>{field.label}</Table.HeadCell>))}
        </Table.Head>
        <Table.Body className="divide-y">
            {data.map((item, index) => (<Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={index}
            >
                {headers.map((field, idx) => (<Table.Cell key={idx}>
                    {field.render ? field.render(item) : item[field.key]}
                </Table.Cell>))}
            </Table.Row>))}
        </Table.Body>
    </Table>);
};

export default DataTable