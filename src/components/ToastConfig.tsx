import React from "react";
import { BaseToast, ErrorToast } from "react-native-toast-message";
import { Text } from "react-native";

const toastTextStyle = {
  fontSize: 14,
  flexWrap: "wrap" as const,
  width: "90%",
};

export const ToastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      text1NumberOfLines={0}
      text1Style={toastTextStyle}
      text2NumberOfLines={0}
      text2Style={toastTextStyle}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1NumberOfLines={0}
      text1Style={toastTextStyle}
      text2NumberOfLines={0}
      text2Style={toastTextStyle}
    />
  ),
};
