import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NoteMajor, FolderMajor } from '@shopify/polaris-icons';
import { Stack, Icon, TextStyle, Tooltip } from '@shopify/polaris';
import isDirectory from '../../utils/tools/isDirectory.utils';
import formatPath from '../../utils/tools/formatPath.utils';
import formatBytes from '../../utils/tools/formatBytes.utils';
import { RowData } from '../../definitions/custom';

import './FileExplorerObject.css';

interface FileExplorerObjectProps {
  name: string;
  path: string;
  size: number;
  content: RowData[];
  lastModified: Date;
  selected: boolean;
  onClick: () => void;
}

export default function FileExplorerObject(props: FileExplorerObjectProps) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonEl = useRef<HTMLButtonElement>(null);

  const { t } = useTranslation();

  const className = `Polaris-Button Polaris-Button--sizeLarge ${
    props.selected
      ? 'Polaris-Button--outline Polaris-Button--pressed no-outline'
      : ''
  } ${
    isHovered && !props.selected
      ? 'Polaris-Button--outline'
      : 'FileExplorerObject__default'
  }`;

  const tooltipContent = (
    <div>
      {formatPath(props.name)}
      <br />
      {t('FileExplorer.FileCard.path', {
        path: `${formatPath(`/${props.path}/`, {
          stripLeading: false,
          stripTrailing: false,
        })}`,
      })}
      {!isDirectory(formatPath(props.name)) && (
        <>
          <br />
          {/* TODO: add size of directory (addition of all files sizes under given path) */}
          {t('FileExplorer.FileCard.size', { size: formatBytes(props.size) })}
          <br />
          {t('FileExplorer.FileCard.modified')}
          <br />
          {`${props.lastModified.toLocaleDateString()} - ${props.lastModified.toLocaleTimeString()}`}
        </>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltipContent}>
      <button
        ref={buttonEl}
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          buttonEl.current?.blur();
          props.onClick();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        type="button">
        <Stack spacing="tight" vertical>
          <Icon
            source={
              isDirectory(formatPath(props.name)) ? FolderMajor : NoteMajor
            }
          />
          <TextStyle
            variation={
              isDirectory(formatPath(props.name)) ? 'strong' : undefined
            }>
            <div className="FileExplorerObject__text">
              {formatPath(props.name)}
            </div>
          </TextStyle>
        </Stack>
      </button>
    </Tooltip>
  );
}
