import { useMutation } from "@tanstack/react-query";
import { AutoComplete, Button, Flex, Form, Input, InputNumber, Modal, Radio, Space, TreeSelect, message } from "antd";
import { useCallback, useEffect, useState } from "react";

import permissionService from "@/api/services/permissionService";
import { useUserPermission } from "@/store/userStore";

import { useTranslation } from "react-i18next";
import type { Permission } from "#/entity";
import { PermissionType } from "#/enum";

// Constants
const ENTRY_PATH = "/src/pages";
const PAGES = import.meta.glob("/src/pages/**/*.tsx");
const PAGE_SELECT_OPTIONS = Object.entries(PAGES).map(([path]) => {
	const pagePath = path.replace(ENTRY_PATH, "");
	return {
		label: pagePath,
		value: pagePath,
	};
});

export type PermissionModalProps = {
	formValue: Permission;
	title: string;
	show: boolean;
	onCancel: (refresh?: boolean) => void;
};

export default function PermissionModal({ title, show, formValue, onCancel }: PermissionModalProps) {
	const [form] = Form.useForm();
	const permissions = useUserPermission();
	const [compOptions, setCompOptions] = useState(PAGE_SELECT_OPTIONS);

	const { t } = useTranslation();

	const createPermissionMutation = useMutation<Permission, unknown, Permission>({
		mutationFn: (data) => {
			return permissionService.createPermission(data);
		},
		onSuccess() {
			message.success("操作成功");
			onCancel(true);
		},
	});

	const updatePermissionMutation = useMutation<Permission, unknown, Permission>({
		mutationFn: (data) => permissionService.updatePermission(data),
		onSuccess() {
			message.success("操作成功");
			onCancel(true);
		},
	});

	const handleFinish = (values: any) => {
		if (title === t("common.createText")) {
			createPermissionMutation.mutate(values);
		} else if (title === t("common.editText")) {
			updatePermissionMutation.mutate({ ...values, id: formValue.id });
		}
	};

	const getParentNameById = useCallback(
		(parentId: string, data: Permission[] | undefined = permissions) => {
			let name = "";
			if (!data || !parentId) return name;
			for (let i = 0; i < data.length; i += 1) {
				if (data[i].id === parentId) {
					name = data[i].name;
				} else if (data[i].children) {
					name = getParentNameById(parentId, data[i].children);
				}
				if (name) {
					break;
				}
			}
			return name;
		},
		[permissions],
	);

	const updateCompOptions = (name: string) => {
		if (!name) return;
		setCompOptions(
			PAGE_SELECT_OPTIONS.filter((path) => {
				return path.value.includes(name.toLowerCase());
			}),
		);
	};

	const onReset = () => {
		form.resetFields();
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		form.setFieldsValue({ ...formValue });
		if (formValue.parentId) {
			const parentName = getParentNameById(formValue.parentId);
			updateCompOptions(parentName);
		}
	}, [formValue, form, getParentNameById]);

	return (
		<Modal forceRender title={title} open={show} onCancel={() => onCancel(true)} footer={null}>
			<Form
				initialValues={formValue}
				form={form}
				onFinish={handleFinish}
				labelCol={{ span: 6 }}
				wrapperCol={{ span: 18 }}
				layout="horizontal"
			>
				<Form.Item<Permission> label="Type" name="type">
					<Radio.Group optionType="button" buttonStyle="solid">
						<Radio value={PermissionType.CATALOGUE}>CATALOGUE</Radio>
						<Radio value={PermissionType.MENU}>MENU</Radio>
					</Radio.Group>
				</Form.Item>

				<Form.Item<Permission> label="Name" name="name" rules={[{ required: true }]}>
					<Input />
				</Form.Item>

				<Form.Item<Permission>
					label="Label"
					name="label"
					rules={[{ required: true }]}
					tooltip="internationalization config"
				>
					<Input />
				</Form.Item>

				<Form.Item<Permission> label="Parent" name="parentId">
					<TreeSelect
						fieldNames={{
							label: "name",
							value: "id",
							children: "children",
						}}
						allowClear
						treeData={permissions}
						onChange={(_value, labelList) => {
							updateCompOptions(labelList[0] as string);
						}}
					/>
				</Form.Item>

				<Form.Item<Permission> label="Route" name="route" rules={[{ required: true }]}>
					<Input />
				</Form.Item>

				<Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
					{({ getFieldValue }) => {
						if (getFieldValue("type") === PermissionType.MENU) {
							return (
								<Form.Item<Permission>
									label="Component"
									name="component"
									required={getFieldValue("type") === PermissionType.MENU}
								>
									<AutoComplete
										options={compOptions}
										filterOption={(input, option) =>
											((option?.label || "") as string).toLowerCase().includes(input.toLowerCase())
										}
									/>
								</Form.Item>
							);
						}
						return null;
					}}
				</Form.Item>

				<Form.Item<Permission> label="Icon" name="icon" tooltip="local icon should start with ic">
					<Input />
				</Form.Item>

				<Form.Item<Permission> label="Hide" name="hide" tooltip="hide in menu">
					<Radio.Group optionType="button" buttonStyle="solid">
						<Radio value={false}>Show</Radio>
						<Radio value>Hide</Radio>
					</Radio.Group>
				</Form.Item>

				<Form.Item<Permission> label="Order" name="order">
					<InputNumber style={{ width: "100%" }} />
				</Form.Item>

				<Flex justify="center">
					<Space>
						<Button htmlType="button" onClick={onReset}>
							重置
						</Button>
						<Button type="primary" htmlType="submit">
							提交
						</Button>
					</Space>
				</Flex>
			</Form>
		</Modal>
	);
}
