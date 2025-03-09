import React, {FormEvent, SVGProps} from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor,
    useDisclosure,
    Form,
    DatePicker,
    Autocomplete,
    AutocompleteItem,
    addToast,
    Select,
    SelectItem,
    SharedSelection,
} from "@heroui/react";
import { IconPencil } from "@tabler/icons-react";
import RequestAPI from "@/utils/http";
import MyModal from "@/components/ui/MyModal";
import {string} from "postcss-selector-parser";
import {useSession} from "next-auth/react";
import {Textarea} from "@heroui/input";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const PlusIcon = ({size = 24, width, height, ...props}: IconSvgProps) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            >
                <path d="M6 12h12" />
                <path d="M12 18V6" />
            </g>
        </svg>
    );
};

export const VerticalDotsIcon = ({size = 24, width, height, ...props}: IconSvgProps) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <path
                d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                fill="currentColor"
            />
        </svg>
    );
};

export const SearchIcon = (props: IconSvgProps) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="M22 22L20 20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
};

export const ChevronDownIcon = ({strokeWidth = 1.5, ...otherProps}: IconSvgProps) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...otherProps}
        >
            <path
                d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={strokeWidth}
            />
        </svg>
    );
};

export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "WORK ORDER NUMBER", uid: "work_order_number", sortable: true },
    { name: "PRODUCT NAME", uid: "product_name", sortable: true },
    { name: "QUANTITY", uid: "quantity", sortable: true },
    { name: "DEADLINE", uid: "deadline", sortable: true },
    { name: "STATUS", uid: "status", sortable: true },
    { name: "OPERATOR", uid: "operator", sortable: true },
    { name: "QTY IN PROGRESS", uid: "quantity_in_progress", sortable: true },
    { name: "NOTES IN PROGRESS", uid: "notes_in_progress", sortable: true },
    { name: "QTY COMPLETED", uid: "quantity_completed", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
    {name: "Pending", uid: "Pending"},
    {name: "In Progress", uid: "In Progress"},
    {name: "Completed", uid: "Completed"},
    {name: "Canceled", uid: "Canceled"},
];

export const data = [
    {
        id: 1,
        work_order_number: "WO-20250309-001",
        product_name: "Timah",
        quantity: 100,
        deadline: "2025-04-29",
        status: "Pending",
        assigned_operator: {
            "id": 2,
            "name": "Operator 1"
        },
        progress: [
            {
                id: 1,
                work_order_id: 1,
                status: "In Progress",
                quantity: 78,
                notes: null,
                created_at: "2025-03-08T14:40:44.000000Z",
                updated_at: "2025-03-08T14:40:44.000000Z"
            }
        ]
    },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
    "In Progress": "warning",
    "Completed": "success",
    "Canceled": "danger",
};

type Data = (typeof data)[0];

interface Operator {
    id: number;
    name: string;
}

interface DataEdit {
    id: number;
    woID: string;
    opId: number;
    status?: string;
    quantity?: number
}

type Status = "In Progress" | "Completed" | "Canceled";

export default function WorkOrderTable() {
    const { data: session } = useSession();
    const user = session?.user;
    const isProductionManager = user?.role === 'Production Manager'

    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [dataWorkOrder, setDataWorkOrder] = React.useState<Data[]>([]);
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "age",
        direction: "ascending",
    });

    const [page, setPage] = React.useState(1);
    const [operator, setOperator] = React.useState<Operator[]>([])
    const [selectedOperatorId, setSelectedOperatorId] = React.useState<number | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [dataEdit, setDataEdit] = React.useState<DataEdit>()
    const [selectedStatus, setSelectedStatus] = React.useState<Status>();

    const modalAdd = useDisclosure()
    const modalEdit = useDisclosure()
    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredDatas = [...dataWorkOrder];

        if (hasSearchFilter) {
            filteredDatas = filteredDatas.filter((data) =>
                data.work_order_number.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredDatas = filteredDatas.filter((data) =>
                Array.from(statusFilter).includes(data.status),
            );
        }

        return filteredDatas;
    }, [dataWorkOrder, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: Data, b: Data) => {
            const first = a[sortDescriptor.column as keyof Data] as number;
            const second = b[sortDescriptor.column as keyof Data] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((dataWorkOrder: Data, columnKey: React.Key) => {
        const cellValue = dataWorkOrder[columnKey as keyof Data];
        const inProgressData = dataWorkOrder.progress?.find(item => item.status === "In Progress");
        const completedData = dataWorkOrder.progress?.find(item => item.status === "Completed");

        switch (columnKey) {
            case "operator":
                // Check if assigned_operator exists and has a name
                return (
                    <span>{dataWorkOrder.assigned_operator?.name || "N/A"}</span>
                );
            case "quantity_in_progress":
                return (
                    <span>{inProgressData ? inProgressData.quantity : 0}</span>
                );
            case "notes_in_progress":
                return (
                    <span>{inProgressData ? (inProgressData.notes ?? "N/A") : "N/A"}</span>
                );
            case "quantity_completed":
                return (
                    <span>{completedData ? completedData.quantity : 0}</span>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={statusColorMap[dataWorkOrder.status]} size="sm" variant="flat">
                        {dataWorkOrder.status}
                    </Chip>
                );
            case "actions":
                return (
                    <Button
                        isDisabled={dataWorkOrder.status === "Completed"}
                        onPress={() => {
                            setDataEdit({
                                id: dataWorkOrder.id,
                                woID: dataWorkOrder.work_order_number,
                                opId: dataWorkOrder.assigned_operator?.id,
                                quantity: dataWorkOrder.quantity,
                            });
                            modalEdit.onOpen();
                        }}
                        variant="flat" color="warning" isIconOnly>
                        <IconPencil />
                    </Button>
                );
            default:
                return <span>cellValue</span>
        }
    }, []);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="mt-12">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between gap-3 items-end">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[44%]"
                            placeholder="Search by work order number..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onClear={() => onClear()}
                            onValueChange={onSearchChange}
                        />
                        <div className="flex gap-3">
                            <Dropdown>
                                <DropdownTrigger className="hidden sm:flex">
                                    <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                        Status
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns"
                                    closeOnSelect={false}
                                    selectedKeys={statusFilter}
                                    selectionMode="multiple"
                                    onSelectionChange={setStatusFilter}
                                >
                                    {statusOptions.map((status) => (
                                        <DropdownItem key={status.uid} className="capitalize">
                                            {capitalize(status.name)}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                            {isProductionManager && (
                                <Button isLoading={isLoading} color="primary" onPress={modalAdd.onOpen} endContent={<PlusIcon />}>
                                    Add New
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-default-400 text-small">Total {dataWorkOrder.length} data</span>
                        <label className="flex items-center text-default-400 text-small">
                            Rows per page:
                            <select
                                className="bg-transparent outline-none text-default-400 text-small"
                                onChange={onRowsPerPageChange}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        onSearchChange,
        onRowsPerPageChange,
        dataWorkOrder.length,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    const fetchDataWorkOrder = async () => {
        try {
            const response = await RequestAPI('/work-order', 'get');
            if (response && response.work_orders) {
                setDataWorkOrder(response.work_orders);
            } else {
                console.error("Unexpected response structure:", response);
            }
        } catch (error) {
            console.error("Error fetching work orders:", error);
            const errorMessage = error instanceof Error ? error.message : "Error while getting the work order";
            addToast({
                title: "Error",
                description: errorMessage,
                timeout: 3000,
                shouldShowTimeoutProgress: true,
                color: "danger",
            });
        }
    };

    const fetchDataOperators = async () => {
        try {
            const response = await RequestAPI('/operators', 'get');
            if (response && response.operators) {
                setOperator(response.operators);
            } else {
                console.error("Unexpected response structure:", response);
            }
        } catch (error) {
            console.error("Error fetching work orders:", error);
        }
    };

    const handleAddWorkOrder = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true)

        const formData = new FormData(event.currentTarget);

        if (selectedOperatorId !== null) {
            formData.append('assigned_operator_id', selectedOperatorId.toString());
        }

        try {
            const response = await RequestAPI('/work-order', 'post', formData);
            if (response && response.status === 'success') {
                fetchDataWorkOrder();
                modalAdd.onClose()
                addToast({
                    title: "Success",
                    description: "Successfully added the work order",
                    timeout: 3000,
                    shouldShowTimeoutProgress: true,
                    color: "success",
                });
            } else {
                addToast({
                    title: "Error",
                    description: "Error while adding the work order",
                    timeout: 3000,
                    shouldShowTimeoutProgress: true,
                    color: "danger",
                });
                console.error("Unexpected response structure:", response);
            }
        } catch (error) {
            console.error("Error saving work order:", error);
            const errorMessage = error instanceof Error ? error.message : "Error while adding the work order";
            addToast({
                title: "Error",
                description: errorMessage,
                timeout: 3000,
                shouldShowTimeoutProgress: true,
                color: "danger",
            });
        }
        setIsLoading(false);
    };

    const handleUpdateWorkOrder = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true)

        const formData = new FormData(event.currentTarget);

        const status = formData.get('status');

        if (status === "" || status === undefined) {
            formData.delete('status');
        }

        if (selectedOperatorId !== null) {
            formData.append('assigned_operator_id', selectedOperatorId.toString());
        }

        try {
            const response = await RequestAPI(`/work-order/${dataEdit?.id}`, 'patch', formData);
            if (response && response.status === 'success') {
                fetchDataWorkOrder();
                modalEdit.onClose()
                addToast({
                    title: "Success",
                    description: "Successfully update the work order",
                    timeout: 3000,
                    shouldShowTimeoutProgress: true,
                    color: "success",
                });
            } else {
                addToast({
                    title: "Error",
                    description: "Error while updating the work order",
                    timeout: 3000,
                    shouldShowTimeoutProgress: true,
                    color: "danger",
                });
                console.error("Unexpected response structure:", response);
            }
        } catch (error) {
            console.error("Error saving work order:", error);
            const errorMessage = error instanceof Error ? error.message : "Error while updating the work order";
            addToast({
                title: "Error",
                description: errorMessage,
                timeout: 3000,
                shouldShowTimeoutProgress: true,
                color: "danger",
            });
        }
        setIsLoading(false);
    };

    const handleUpdateWorkOrderForOperator = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true)

        const formData = new FormData(event.currentTarget);

        if (dataEdit?.id) {
            formData.append('work_order_id', dataEdit.id.toString());
        }

        try {
            const response = await RequestAPI(`/progress/work-order/`, 'post', formData);
            if (response && response.status === 'success') {
                fetchDataWorkOrder();
                modalEdit.onClose()
                addToast({
                    title: "Success",
                    description: "Successfully update the work order",
                    timeout: 3000,
                    shouldShowTimeoutProgress: true,
                    color: "success",
                });
            } else {
                addToast({
                    title: "Error",
                    description: "Error while updating the work order",
                    timeout: 3000,
                    shouldShowTimeoutProgress: true,
                    color: "danger",
                });
                console.error("Unexpected response structure:", response);
            }
        } catch (error) {
            console.error("Error saving work order:", error);
            const errorMessage = error instanceof Error ? error.message : "Error while updating the work order";
            addToast({
                title: "Error",
                description: errorMessage,
                timeout: 3000,
                shouldShowTimeoutProgress: true,
                color: "danger",
            });
        }
        setIsLoading(false);
    };

    const handleSelectionChange = (keys: SharedSelection) => {
        const value = keys.currentKey as Status;
        setSelectedStatus(value);
    };

    React.useEffect(() => {
        fetchDataWorkOrder();
        if (isProductionManager) {
            fetchDataOperators();
        }
    }, []);

    return <>
        <Table
            isHeaderSticky
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px]",
            }}
            selectedKeys={selectedKeys}
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
            className="w-10/12 mx-auto mb-12"
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"No data found"} items={sortedItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => (
                            <TableCell>
                                {renderCell(item, columnKey)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
        <MyModal title="Add Work Order" isOpen={modalAdd.isOpen} onOpen={modalAdd.onOpen} onOpenChange={modalAdd.onOpenChange}>
            <Form className="w-full px-2" validationBehavior="aria" onSubmit={handleAddWorkOrder}>
                <Input
                    isRequired
                    label="Product Name"
                    labelPlacement="inside"
                    name="product_name"
                    placeholder="Enter product name"
                    type="text"
                />

                <Input
                    isRequired
                    label="Quantity Order"
                    labelPlacement="inside"
                    name="quantity"
                    placeholder="Enter quantity order"
                    type="number"
                />

                <DatePicker label="Deadline" name="deadline" isRequired/>

                <Autocomplete
                    isRequired
                    defaultItems={operator}
                    label="Operator"
                    placeholder="Search operator"
                    onSelectionChange={(key) => {
                        setSelectedOperatorId(key as number);
                    }}
                >
                    {operator.map((user) => (
                        <AutocompleteItem key={user.id}>{user.name}</AutocompleteItem>
                    ))}
                </Autocomplete>

                <Button isLoading={isLoading} type="submit" color="primary" variant="solid" className="my-5 w-full">
                    Submit
                </Button>
            </Form>
        </MyModal>

        <MyModal title={`Edit ${dataEdit?.woID}`} isOpen={modalEdit.isOpen} onOpen={modalEdit.onOpen} onOpenChange={modalEdit.onOpenChange}>
            <Form className="w-full px-2" validationBehavior="aria" onSubmit={isProductionManager ? handleUpdateWorkOrder : handleUpdateWorkOrderForOperator}>
                <Select isRequired={!isProductionManager} label="Status Work Order" placeholder="Select status" name="status" onSelectionChange={handleSelectionChange}>
                    {isProductionManager ? (
                        <SelectItem key="Canceled">Canceled</SelectItem>
                    ) : null}

                    {dataEdit?.status === 'In Progress' ? (
                        <SelectItem key="Completed">Completed</SelectItem>
                    ) : <>
                        <SelectItem key="In Progress">In Progress</SelectItem>
                        <SelectItem key="Completed">Completed</SelectItem>
                    </>}
                </Select>

                {selectedStatus === 'In Progress' && (
                    <Textarea
                        label="Notes"
                        labelPlacement="inside"
                        placeholder="Enter your notes"
                        name="notes"
                    />
                )}

                <Input
                    isRequired
                    label="Quantity Order"
                    labelPlacement="inside"
                    name="quantity"
                    placeholder="Enter quantity order"
                    type="number"
                    max={dataEdit?.quantity}
                />

                {isProductionManager && (
                    <Autocomplete
                        defaultItems={operator}
                        label="Operator"
                        placeholder="Search operator"
                        defaultSelectedKey={dataEdit?.opId}
                        onSelectionChange={(key) => {
                            setSelectedOperatorId(key as number);
                        }}
                    >
                        {operator.map((user) => (
                            <AutocompleteItem key={user.id}>{user.name}</AutocompleteItem>
                        ))}
                    </Autocomplete>
                )}

                <Button isLoading={isLoading} type="submit" color="primary" variant="solid" className="my-5 w-full">
                    Submit
                </Button>
            </Form>
        </MyModal>
    </>
}