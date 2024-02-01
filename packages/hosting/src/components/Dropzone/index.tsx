import { FC, MouseEvent, useCallback, useState } from "react";
import { RegisterOptions, Controller, useFormContext } from "react-hook-form";
import { Accept, FileRejection, useDropzone } from "react-dropzone";
import { twJoin } from "tailwind-merge";

import type { File, FileWithPreview } from "@/types/firestore";
import { FilePreview } from "./FilePreview";

type DropzoneInputProps = {
  accept?: Accept;
  helperText?: string;
  id: string;
  label: string;
  maxFiles?: number;
  readOnly?: boolean;
  validation?: RegisterOptions;
};

export const DropzoneInput: FC<DropzoneInputProps> = (props) => {
  const { accept, helperText = "", id, label, maxFiles = 1, validation, readOnly } = props;
  const { control, getValues, setValue, setError, clearErrors, formState } = useFormContext();

  const { errors } = formState;

  const [files, setFiles] = useState<FileWithPreview[]>(getValues(id) || []);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        setValue(id, files ? [...files] : null, {
          shouldValidate: true
        });
        setError(id, {
          type: "manual",
          message: rejectedFiles[0].errors[0].message,
        });
      } else {
        const acceptedFilesPreview = acceptedFiles.map((file: File) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        setFiles(files ? [...files, ...acceptedFilesPreview].slice(0, maxFiles) : acceptedFilesPreview);

        setValue(id, files ? [...files, ...acceptedFiles].slice(0, maxFiles) : acceptedFiles, {
          shouldValidate: true,
        });
        clearErrors(id);
      }
    },
    [clearErrors, files, id, maxFiles, setError, setValue]
  );

  // useEffect(() => {
  //   files.forEach((file) => URL.revokeObjectURL(file.preview));
  // },
  //   [files]
  // );

  const deleteFile = (e: MouseEvent, file: FileWithPreview) => {
    e.preventDefault();
    const newFiles = [...files];

    newFiles.splice(newFiles.indexOf(file), 1);

    if (newFiles.length > 0) {
      setFiles(newFiles);
      setValue(id, newFiles, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    } else {
      setFiles([]);
      setValue(id, null, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize: 2000000,
  });

  if (readOnly && !(files?.length > 0)) {
    return (
      <div>
        <label className="block text-sm font-normal text-gray-700" htmlFor={id}>
          {label}
        </label>
        <div className="divide-y divide-gray-300 rounded-md border border-gray-300 py-3 pl-3 pr-4 text-sm">
          No file uploaded
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-normal text-gray-700" htmlFor={id}>
        {label}
      </label>
      <Controller
        control={control}
        name={id}
        rules={validation}
        render={(controllerProps) => (
          <>
            {files.length === maxFiles ? null : (
              <div
                className="focus:ring-dark-400 group mt-1 focus:outline-none"
                {...getRootProps()}
                {...controllerProps}
              >
                <input {...getInputProps()} />
                <div
                  className={twJoin(
                    "w-full cursor-pointer rounded border border-dashed border-gray-300 bg-gray-100 p-2",
                    errors[id] ? "border-red-500 group-focus:border-red-500" : "group-focus:border-primary-500"
                  )}
                >
                  <div className="my-20 space-y-2 text-center">
                    <p className="text-gray-500">Drag &apos;n&apos; drop some files here, or click to select files</p>
                    <p className="text-xs text-gray-500">{`${maxFiles - (files?.length || 0)} file(s) remaining`}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-1">
              {helperText !== "" && <p className="text-xs text-gray-500">{helperText}</p>}
              {errors.length && errors[id] ? (
                <span className="text-sm text-red-500">{JSON.stringify(errors[id]?.message, null, 2)}</span>
              ) : null}
            </div>
            {!readOnly && !!files?.length && (
              <ul className="mt-1 divide-y divide-gray-300 rounded-md border border-gray-300">
                {files.map((file) => (
                  <FilePreview key={file.toString()} readOnly={readOnly} file={file} deleteFile={deleteFile} />
                ))}
              </ul>
            )}
          </>
        )}
      />
    </div>
  );
};
