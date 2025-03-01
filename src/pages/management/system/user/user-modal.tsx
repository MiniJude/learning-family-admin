import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Form, Input, Modal, Space, message } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import userService from "@/api/services/userService";
import type { UserInfo } from "#/entity";

export type UserModalProps = {
	formValue: UserInfo;
	title: string;
	show: boolean;
	onCancel: (refresh?: boolean) => void;
};

export function UserModal({ title, show, formValue, onCancel }: UserModalProps) {
	const [form] = Form.useForm();
	const { t } = useTranslation();

	const createUserMutation = useMutation<UserInfo, unknown, UserInfo>({
		mutationFn: (data) => userService.createUser(data),
		onSuccess: () => {
			message.success(t("sys.api.operationSuccess"));
			onCancel(true);
		},
	});

	const updateUserMutation = useMutation<UserInfo, unknown, UserInfo>({
		mutationFn: (data) => {
			const { id, ...rest } = data;
			return userService.updateUser(id, rest);
		},
		onSuccess: () => {
			message.success(t("sys.api.operationSuccess"));
			onCancel(true);
		},
	});

	const handleFinish = (values: any) => {
		if (title === t("common.createText")) {
			createUserMutation.mutate(values);
		} else if (title === t("common.editText")) {
			updateUserMutation.mutate({ ...values, id: formValue.id });
		}
	};

	const onReset = () => {
		form.resetFields();
	};

	useEffect(() => {
		form.setFieldsValue({ ...formValue });
	}, [formValue, form]);

	return (
		<Modal forceRender title={title} open={show} onCancel={() => onCancel(true)} footer={null}>
			<Form
				initialValues={formValue}
				form={form}
				onFinish={handleFinish}
				labelCol={{ span: 6 }}
				wrapperCol={{ span: 16 }}
				layout="horizontal"
			>
				<Form.Item<UserInfo> label="Email" name="email" required rules={[{ type: "email", required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item<UserInfo> label="Nick Name" name="nickName" required rules={[{ required: true }]}>
					<Input />
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
