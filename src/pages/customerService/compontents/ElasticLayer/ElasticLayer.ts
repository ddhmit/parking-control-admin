interface ModalProps {
  visiable: boolean;
  title: string;
  isEdit: boolean;
  onFinishFunction: (value: formProps, isEdit: number | undefined) => void;
  cancelFunction: () => void;
  editNumber: number | undefined;
  isEditData: any;
  loading: boolean;
}
interface formProps {
  account: string;
  password: string;
  nextpassword: string;
}
export { ModalProps, formProps };
