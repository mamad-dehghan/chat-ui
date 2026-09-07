import {
  CameraIcon,
  FileIcon,
  ImageSquareIcon,
  LinkSimpleBreakIcon,
  MapPinIcon,
  UserIcon,
  XIcon,
} from "@phosphor-icons/react";
import { Drawer, fillOptions, IconButton, NavBar, sizeOptions } from "kitty";
import { ReactNode, useEffect } from "react";
import { create } from "zustand";
import "./file_button.scss";
import { DraftMessage, messageAttachment } from "./types";

export const FileButton = () => {
  const toggle = useInputStore((state) => state.toggle);
  const close = useInputStore((state) => state.close);
  const reset = useInputStore((state) => state.reset);
  const isOpen = useInputStore((state) => state.isOpen);

  useEffect(() => reset, []);

  return (
    <>
      <IconButton
        size={sizeOptions.small}
        fill={fillOptions.fill}
        Icon={LinkSimpleBreakIcon}
        onClick={toggle}
      />
      <Drawer isOpen={isOpen} direction="bottom" onClose={close}>
        <div
          style={{
            backgroundColor: "saddlebrown",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            maxHeight: "100vh",
          }}
        >
          <NavBar
            media="md"
            items={[
              {
                title: "Contacts",
                Icon: UserIcon,
                content: <div>Contacts</div>,
              },
              {
                title: "Gallery",
                Icon: ImageSquareIcon,
                content: <ImageTab />,
              },
              {
                title: "Location",
                Icon: MapPinIcon,
                content: (
                  // <geolocation>
                  <button
                    onClick={() => {
                      navigator.geolocation.getCurrentPosition(
                        console.log,
                        console.error,
                        // (position) => {
                        //   outputElem.textContent += `(${position.coords.latitude}, ${position.coords.longitude}), `;
                        // },
                        // (error) => {
                        //   outputElem.textContent += `${error.message}, `;
                        // },
                      );
                    }}
                  >
                    Use loc
                  </button>
                  // </geolocation>
                ),
              },
              {
                title: "Files",
                Icon: FileIcon,
                content: <FileTab />,
              },
              {
                title: "Camera",
                Icon: CameraIcon,
                content: (
                  <div
                    onClick={async () => {
                      const dirHandle = await window.showDirectoryPicker();
                      console.log(dirHandle);
                    }}
                  >
                    Camera
                  </div>
                ),
              },
            ]}
            initialActiveItem="Camera"
          />
        </div>
      </Drawer>
    </>
  );
};

interface InputStore {
  type: messageAttachment["type"] | "empty";
  content: File[];
  viewer: (content: File[]) => ReactNode;
  update: (_: Pick<InputStore, "type" | "content" | "viewer">) => void;
  removeItem: (_: File) => void;
  toggle: () => void;
  close: () => void;
  isOpen: boolean;
  reset: () => void;
  getAsAttachment: () => DraftMessage["attachment"];
}

export const useInputStore = create<InputStore>((set, get) => ({
  type: "empty",
  content: [],
  isOpen: false,
  toggle: () => set((st) => ({ isOpen: !st.isOpen })),
  close: () => set({ isOpen: false }),
  reset: () => set({ type: "empty", content: [], isOpen: false }),
  update: ({ type, content, viewer }) =>
    set({
      isOpen: false,
      type,
      content,
      viewer,
    }),
  removeItem(item: File) {
    set((state) => {
      const newList = state.content.filter((i) => item !== i);
      if (newList.length === state.content.length) return {};
      return newList.length === 0
        ? {
          content: [],
          viewer: () => <></>,
          type: "empty",
        }
        : {
          content: newList,
        };
    });
  },
  viewer: () => <></>,
  getAsAttachment: () => {
    const attachment = get();
    const attachmentType = attachment.type;

    if (attachmentType === "empty") return null;
    else
      return attachment.content.map((file) => ({
        type: attachmentType,
        name: file.name,
        file,
      }));
  },
}));

const FileTab = () => {
  const updateStore = useInputStore((state) => state.update);

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(event) => {
          if (event.currentTarget.files?.length) {
            updateStore({
              type: "file",
              content: Array.from(event.currentTarget.files),
              viewer: (files) => (
                <div>
                  {files.map((file, index) => (
                    <FileContentViewer key={file.name + index} file={file} />
                  ))}
                </div>
              ),
            });
          }
        }}
      />
    </div>
  );
};

const FileContentViewer = ({ file }: { file: File }) => {
  const removeItem = useInputStore((state) => state.removeItem);
  return (
    <div className="file-content--viewer">
      <div className="type-icon">
        <FileIcon weight="fill" />
      </div>
      <div className="size">{file.size} Byte</div>
      <div className="file-name">{file.name}</div>
      <IconButton
        className="close-button"
        size={sizeOptions.small}
        fill={fillOptions.link}
        Icon={XIcon}
        onClick={() => {
          removeItem(file);
        }}
      />
    </div>
  );
};

const ImageTab = () => {
  const updateStore = useInputStore((state) => state.update);

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={(event) => {
          if (event.currentTarget.files?.length) {
            updateStore({
              type: "image",
              content: Array.from(event.currentTarget.files),
              viewer: (files) => (
                <div>
                  {files.map((file, index) => (
                    <ImageContentViewer key={file.name + index} file={file} />
                  ))}
                </div>
              ),
            });
          }
        }}
      />
    </div>
  );
};

const ImageContentViewer = ({ file }: { file: File }) => {
  const removeItem = useInputStore((state) => state.removeItem);
  console.log(file.webkitRelativePath);
  return (
    <div className="image-content--viewer">
      <div className="preview">
        {/*<FileIcon weight="fill" />*/}
        <img src={URL.createObjectURL(file)} />
        {/*<img />*/}
      </div>
      <div className="size">{file.size} Byte</div>
      <div className="file-name">{file.name}</div>
      <IconButton
        className="close-button"
        size={sizeOptions.small}
        fill={fillOptions.link}
        Icon={XIcon}
        onClick={() => {
          removeItem(file);
        }}
      />
    </div>
  );
};
