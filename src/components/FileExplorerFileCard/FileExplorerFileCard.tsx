import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Card, Scrollable, EmptyState } from '@shopify/polaris';
import FileExplorerObject from '../FileExplorerObject/FileExplorerObject';
import BreadCrumbs from '../FileExplorerBreadCrumbs/FileExplorerBreadCrumbs';
import isDirectory from '../../utils/tools/isDirectory.utils';
import formatPath from '../../utils/tools/formatPath.utils';
import getPathRelativeName from '../../utils/tools/getPathRelativeName.utils';
import { BucketObject } from '../../definitions/custom';
import { Spinner } from '../Spinner/Spinner';

export interface FileExplorerFileCardProps {
  content: BucketObject[];
  selected: string | undefined;
  setSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  isLoading: boolean;
  path: string[];
  setPath: React.Dispatch<React.SetStateAction<string[]>>;
  onClickUpload: () => void;
  onClickObject: (id: string) => void;
  // TODO: implement sorting
}

export default function FileExplorerFileCard(
  props: FileExplorerFileCardProps
) {
  const [content, setContent] = useState<React.ReactElement[]>([]);

  const { t } = useTranslation();

  const resetSelection = useCallback(() => {
    props.setSelected(undefined);
  }, [props]);

  const getContent = useCallback(() => {
    const content = props.content.filter(
      (obj) => obj.name !== props.path.at(-1)
    );
    const rootFiles: React.ReactElement[] = [];
    const rootDirs: React.ReactElement[] = [];

    content.forEach((o) => {
      const fullName = `${o.path}/${o.name}`;
      const name = getPathRelativeName(fullName, props.path);
      const path = props.path;
      const isDir = isDirectory(name);

      const objEl = (
        <FileExplorerObject
          {...o}
          key={o.id}
          name={name}
          path={path.join('/')}
          selected={props.selected === o.id}
          onClick={() => props.onClickObject(o.id)}
        />
      );

      if (fullName.includes(props.path.join('/'))) {
        if (isDir) {
          if (!rootDirs.find((x) => formatPath(x.props['name']) === name)) {
            rootDirs.push(objEl);
          }
        } else {
          rootFiles.push(objEl);
        }
      }
    });

    return [...rootDirs, ...rootFiles];
  }, [props]);

  useEffect(() => {
    setContent(getContent());
  }, [getContent, props.path]);

  return (
    <Card>
      <Card.Section>
        <div style={{ minHeight: '360px' }} onClick={resetSelection}>
          <Stack vertical>
            <Stack.Item>
              <BreadCrumbs path={props.path} onChange={props.setPath} />
            </Stack.Item>
            {content.length > 0 ? (
              <Stack.Item>
                <Scrollable style={{ height: '100%', padding: '1%' }}>
                  <Stack spacing="tight" wrap>
                    {content}
                  </Stack>
                </Scrollable>
              </Stack.Item>
            ) : (
              <Stack.Item fill>
                {/* <div style={{ width: '640px' }}> */}
                {props.isLoading && <Spinner />}
                <div>
                  <EmptyState
                    heading={t(
                      'FileExplorer.FileCard.noFilesEmptyStateHeading'
                    )}
                    action={{
                      content: t(
                        'FileExplorer.FileCard.noFilesEmptyStateAction'
                      ),
                      onAction: () => props.onClickUpload(),
                    }}
                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png">
                    {t('FileExplorer.FileCard.noFilesEmptyStateText')}
                  </EmptyState>
                </div>
              </Stack.Item>
            )}
          </Stack>
        </div>
      </Card.Section>
    </Card>
  );
}
