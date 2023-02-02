import { FC, useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { ref, getBlob } from "firebase/storage";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { storage, db } from "@/lib/firebase";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/Form";
import { Seo } from "@/components/Seo";
import { DownloadModal } from "@/components/DownloadModal";
import { checkTimestampAge } from "@/utils/checkTimestampAge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StyledLink } from "@/components/ui/StyledLink";
import { Checkbox } from "@/components/ui/Checkbox";

const FileDownload: FC = () => {
  const [objectUrl, setObjectUrl] = useState<string>();
  const [saveName, setSaveName] = useState<string>("");
  const [searchParams] = useSearchParams();
  const { fileId } = useParams() as {
    fileId: string;
  };
  const firestoreRef = doc(db, "files", fileId);
  const [dbValue, loading, error] = useDocumentData(firestoreRef);
  const paramsNow = searchParams.get("t");
  const isOld = checkTimestampAge(parseInt(paramsNow!, 10), 1000 * 60 * 60 * 2);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isLoadingCompoliteButFailed = !loading && !dbValue;

  async function setFileBlob(storageFilePath: string) {
    const storageRef = ref(storage, storageFilePath);
    const blob = await getBlob(storageRef);
    setObjectUrl(URL.createObjectURL(blob));
  }

  useEffect(() => {
    if (isOld || loading || !dbValue) return;
    setSaveName(dbValue.name);
    setFileBlob(`files/${dbValue.path}`);
  }, [dbValue]);

  const handleConfirm = useCallback(() => {
    setIsConfirmed((prev) => !prev);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!dbValue || !objectUrl) return;
    await updateDoc(firestoreRef, {
      downloaded: dbValue!.downloaded + 1,
    })
      .then(() => {
        URL.revokeObjectURL(objectUrl);
        setIsConfirmed(false);
        setObjectUrl("");
        setIsOpen(true);
      });
  }, [dbValue, objectUrl]);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (isOld) {
    throw new Error("リンクが古くなっています。")
  } else if (isLoadingCompoliteButFailed) {
    throw new Error(JSON.stringify(error))
  }
  // else if (!objectUrl) {
  //   throw new Error("ファイルは削除された可能性があります")
  // }

  return (
    <Container className="">
      <Seo noindex />
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-center text-xl">ダウンロード</h1>
        <div className="flex flex-col gap-6">
          <div className="mb-4 text-base sm:text-lg">
            {saveName}&nbsp;のダウンロードを続けるには
            <StyledLink href="/terms" className="mx-2" isExternal>
              利用規約
            </StyledLink>
            に同意した上で「ダウンロード」ボタンを押下してください。ダウンロードが開始されます。
          </div>
          <div className="mb-4">
            <Checkbox id="confirm" checked={isConfirmed} onChange={handleConfirm} label="利用規約に同意する" />
          </div>
          <div className="flex flex-col gap-4">
            {isConfirmed && objectUrl ? (
              <a
                href={objectUrl}
                download={saveName}
                className="block w-full rounded-lg bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 sm:w-auto"
                onClick={handleDownload}
              >
                ダウンロード
              </a>
            ) : (
              <Button type="button" disabled>
                読み込み中
              </Button>
            )}
            <ButtonLink to="/files">ファイル一覧へ戻る</ButtonLink>
          </div>
        </div>
      </div>
      <DownloadModal isOpen={isOpen} onClose={handleCloseModal} />
    </Container>
  );
};

export default FileDownload;
