import React from "react";
import useSWRInfinite from "swr/infinite";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import LoadingButton from "@mui/lab/LoadingButton";

import MsgItem from "@/components/msgItem";
import MessageLoading from "./messageLoading";
import { IMsgData, EModifyType } from "@/types";
import { getMessages } from "@/fetch/api";
import Store from "@/context";

interface IProps {
  conversationId?: string;
}

export default function Messages(props: IProps) {
  const { conversationId } = props;
  const { state, dispatch } = React.useContext(Store);

  const listRef = React.useRef<HTMLUListElement>(null);

  const getKey = (pageIndex: number, previousPageData: IMsgData[]) => {
    // reached the end
    if (previousPageData && !previousPageData.length) return null;

    // index, no `previousPageData`
    if (pageIndex === 0) return `conversationId=${conversationId}`;

    // add cursor to API
    return new URLSearchParams({
      lastMessageId: previousPageData[0].id,
      conversationId: conversationId as string,
    }).toString();
  };

  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite(getKey, getMessages, {
      revalidateAll: false,
      revalidateFirstPage: false,
    });

  React.useEffect(() => {
    if (
      data?.length === 1 &&
      isLoading === false &&
      state.messages.length &&
      listRef.current
    ) {
      // @ts-ignore
      listRef.current?.lastChild?.scrollIntoViewIfNeeded?.();
    }
  }, [isLoading, data, state.messages, listRef]);

  React.useEffect(() => {
    if (data?.length && data?.slice(-1)[0].length) {
      dispatch({
        type: EModifyType.MULTI_UNSHIFT_MESSAGE,
        payload: data.slice(-1)[0],
      });
    } else {
      dispatch({ type: EModifyType.CLEAR_MESSAGE, payload: null });
    }
  }, [data, dispatch]);

  // const messages = data ? [].concat(...data) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 10);
  const isRefreshing = !!(isValidating && data && data);

  return (
    <>
      <List
        sx={{
          width: "100%",
          height: "calc(100% - 54px)",
          pb: 0,
          overflow: "auto",
          bgcolor: "background.paper",
        }}
        ref={listRef}
      >
        {isLoading ? (
          <MessageLoading />
        ) : (
          <>
            <ListItem sx={{ justifyContent: "center" }}>
              {isEmpty && !state.messages.length ? (
                <ListItemText sx={{ textAlign: "center" }}>
                  Yay, no messages found.
                  <LoadingButton
                    disabled={isRefreshing}
                    loading={isRefreshing}
                    onClick={() => mutate()}
                    size="small"
                  >
                    <span>{isRefreshing ? "refreshing..." : "refresh"}</span>
                  </LoadingButton>
                </ListItemText>
              ) : (
                <LoadingButton
                  disabled={isLoadingMore || isReachingEnd}
                  size="small"
                  loading={isLoadingMore}
                  onClick={() => setSize(size + 1)}
                >
                  <span>
                    {isLoadingMore
                      ? "loading..."
                      : isReachingEnd
                      ? `no more messages (${state.messages.length} total)`
                      : "load more"}
                  </span>
                </LoadingButton>
              )}
            </ListItem>
            {state.messages.map((item: IMsgData) => (
              <MsgItem
                key={item.id}
                type={item.role}
                content={item.content}
              ></MsgItem>
            ))}
          </>
        )}
      </List>
    </>
  );
}
