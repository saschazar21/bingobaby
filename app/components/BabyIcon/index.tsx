import { FC } from "react";
import classNames from "clsx";

import styles from "./BabyIcon.module.css";

export interface BabyIconProps {
  className?: string;
}

export const BabyIcon: FC<BabyIconProps> = ({ className: customClassName }) => {
  const className = classNames(customClassName, styles.icon);

  return (
    <svg
      role="presentation"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      viewBox="0 0 336 256"
    >
      <path
        fill="currentColor"
        d="M141.469 257c-16.875-4.456-32.863-10.094-48.555-16.64-19.543-8.151-39.217-15.986-55.644-29.933-11.7-9.935-21.752-21.246-23.792-36.975-3.402-26.227 2.948-49.976 21.192-69.748 5.673-6.147 13.573-9.586 20.087-14.79 3.019-2.412 5.056-4.716 5.404-8.893.829-9.933 6.681-17.64 12.62-25.07 8.65-10.82 18.673-20.415 28.624-29.982 11.09-10.662 32.81-12.695 45.833-5.133 1.856 1.078 3.564 1.448 5.67 1.02 11.912-2.423 23.839-2.262 35.729.17 1.892.387 3.538.243 5.302-.566 18.198-8.346 35.818-5.502 49.733 9.04 9.422 9.848 19.287 19.385 27.188 30.608 4.922 6.99 9.428 14.172 9.602 23.165.052 2.718 1.741 4.636 3.754 6.215 3.012 2.365 5.922 4.927 9.181 6.9 19.734 11.947 28.029 30.737 32.092 52.336 3.73 19.827.508 37.87-13.024 53.263-9.122 10.376-20.408 18.143-32.712 24.306-24.632 12.34-50.18 22.337-76.858 29.35-.797.21-1.541.615-2.603 1.143-19.646.214-39 .214-58.823.214m77.63-19.356c-2.322 2.923-6.493 3.56-9.024 6.895.992.137 1.523.372 1.942.244 12.575-3.86 25.223-7.646 36.58-14.463 6.535-3.922 8.447-10.4 7.661-17.745-.31-2.9-1-5.79.124-9.748 5.571 8.372 3.712 16.343 1.193 25.267 13.476-5.41 24.856-11.849 35.672-19.356 21.851-15.168 29.868-35.836 24.3-61.73-3.669-17.055-10.312-32.454-25.868-42.24-4.389-2.76-8.663-5.667-12.491-9.115-2.554-2.3-4.868-3.795-7.874-1.314-1.258-1.451-.559-2.506-.065-3.527 2.28-4.712 1.712-9.367-.17-14.03-1.69-4.19-3.777-8.144-6.444-11.81-8.467-11.64-19.024-21.397-28.754-31.892-4.424-4.771-10.383-7.387-16.7-8.45-7.433-1.25-15.157-1.908-21.408 3.573-5.265 4.615-10.587 9.126-16.156 13.366-6.696 5.097-9.226 11.959-8.191 20.238.129 1.034 1.24 2.14-.37 3.37-1.46-1.438-3.71-1.019-5.637-1.749.588-5.177 1.271-10.324-1.636-14.435-7.38-10.435-16.777-19.597-28.34-24.282-10.863-4.402-22.652-1.438-31.545 7.078-9.131 8.745-18.216 17.612-26.243 27.428-8.186 10.01-15.708 20.313-8.758 34.254.033.065-.174.25-.672.927-5.026-6.075-8.297-.667-12.085 1.95-2.328 1.609-4.418 3.624-6.883 4.966-16.575 9.027-24.341 24.25-28.544 41.544-3.639 14.976-4.827 30.302 4.032 44.056 12.822 19.904 32.903 30.218 54.09 39.824-3.057-14.953-2.58-20.413 2.244-25.252.712 3.234-.22 6.108-.584 8.998-1.262 9.994 1.75 15.737 10.516 20.514 9.265 5.05 19.327 8.103 29.136 11.784 1.773.665 3.575 2.25 6.722 1.078-7.715-4.96-14.285-10.003-18.07-17.747-3.762-7.7-5.788-15.61-3.407-24.485 2.638 1.403 1.868 3.467 2.025 5.125 1.804 19.112 11.502 31.355 29.453 36.76 16.733 5.037 33.738 5.68 50.913 2.668 6.43-1.127 12.642-2.881 18.488-5.892 11.838-6.098 18.69-15.626 20.52-28.867.394-2.854-.199-6.186 3.035-9.145 2.017 14.382-2.699 25.46-12.727 35.367M152.783 30.242c5.217 6.61 13.767 9.83 17.762 19.248 4.26-9.559 13.045-12.655 19.127-19.278-3.666-1.878-7.013-2.229-10.231-2.459-8.891-.635-17.841-1.38-26.658 2.49z"
      />
      <path
        fill="currentColor"
        d="M228.596 179.544c-3.001 5.611-5.84 10.892-8.626 16.2-5.855 11.15-15.946 15.473-28.091 11.86-3.667-1.09-7.33-2.299-10.826-3.839-8.123-3.578-16.12-3.376-24.242-.038-3.225 1.325-6.605 2.287-9.947 3.309-11.853 3.623-21.903-.413-27.808-11.42-6.376-11.889-12.508-23.909-18.786-35.85-2.75-5.234-3.664-5.285-7.576-.696-1.678 1.968-2.9 4.396-5.44 5.853-.582-7.196 12.423-20.758 21.992-22.953-1.161 4.939-7.071 5.474-8.762 10.544 11.702 2.846 20.098 11.244 29.896 17.38 6.072 3.804 13.173 4.303 19.859 2.365 12.666-3.673 25.07-4.092 37.71-.049 9.544 3.053 18.19.964 26.396-4.916 7.671-5.496 15.583-10.774 24.947-14.097-2.178-4.429-7.146-5.84-9.202-10.085 7.93.13 21.014 13.563 22.692 23.23-3.23-.881-4.218-3.738-5.825-5.748-3.98-4.984-5.043-4.988-8.247.711-3.347 5.953-6.621 11.946-10.114 18.239m-18.914 18.218c-5.12-5.06-12.71-4.685-15.678.775-1.9 3.492-.812 5.914 3.056 6.353 3.658.416 7.337.388 10.742-1.356 2.117-1.084 3.612-2.51 1.88-5.772m-66.09 2.259c-2.843-5.76-7.649-8.116-12.327-5.944-2 .929-4.022 2.254-4.242 4.554-.244 2.562 2.088 3.632 4.024 4.529 2.742 1.271 5.683 1.872 8.741 1.58 2.404-.228 4.26-1.027 3.803-4.72zM139.942 80.821c6.085 3.18 10.65 7.354 13.658 13.208 3.436 6.686 2.55 11.507-3.289 16.23-5.177 4.189-11.238 6.39-17.682 7.642-11.764 2.287-23.498 2.715-34.89-1.688-6.635-2.564-13.646-6.096-14.615-13.636-1.012-7.888 3.932-14.58 10.278-18.834 14.609-9.79 30.304-9.395 46.54-2.922m-34.971 31.896c-6.066-9.222-6.583-18.794-.895-28.651-4.555-.238-6.723.264-10 3.652-11.467 11.854-9.866 17.127 2.704 24.054 2.492 1.374 5.148 3.471 8.19.945m4.049-17.034c1.216 3.306 3.445 5.334 7.103 4.951 3.27-.342 5.55-2.334 6.331-5.493.71-2.872-.775-5.126-3.038-6.84-2.075-1.569-4.394-1.513-6.584-.477-2.95 1.397-4.555 3.74-3.812 7.859zM245.593 84.311c5.004 3.767 7.52 8.734 9.674 14.073 1.905 4.722.64 8.362-2.689 11.753-6.437 6.557-14.606 9.044-23.407 9.922-11.66 1.163-22.907-.616-33.695-5.198a25.966 25.966 0 0 1-3.956-2.108c-9.465-6.14-10.784-12.76-3.95-21.594 10.013-12.944 24.03-15.241 39.07-13.637 6.594.702 13.095 2.53 18.953 6.79m-8.11 22.354-3.9 8.618c7.853-.939 13.637-4.295 18.182-9.958.877-1.093 1.051-2.402.94-3.767-.618-7.657-10.144-17.145-18.644-18.07 3.802 7.208 6.724 14.4 3.422 23.177m-29.381-6.163c3.546-.979 6.124-3.106 5.997-6.926-.097-2.926-1.772-5.408-4.863-6.273-3.025-.846-5.586.156-7.516 2.598-3.276 4.144-.617 9.12 6.382 10.601m-20.89.875c.191 1.39.288 2.846 2.668 3.299l-1.167-6.895-1.018.125c-.165.94-.33 1.88-.482 3.47z"
      />
      <path
        fill="currentColor"
        d="M250.98 72.149c2.105 5.048 5.43 9.35 5.197 15.73-12.153-11.753-20.55-26.583-41.156-23-17.821 3.098-30.727 9.62-34.495 30.025-3.362-8.76 1.14-18.56 10.095-25.427 7.523-5.77 16.567-7.276 25.72-8.714-1.086-2.327-3.908-1.599-5.19-4.35 12.421-.325 22.034 5.559 31.815 11.475-3.394-6.671-8.639-11.621-14.753-15.412-6.345-3.934-13.188-7.066-19.806-10.561-2.407-1.272-4.429-.358-6.536.891-7.565 4.487-13.037 10.75-16.45 18.853-.806 1.914-1.115 4.194-3.3 5.306-1.748-.932-.994-2.327-.736-3.522 1.842-8.542 6.709-15.146 13.491-20.383 9.733-7.515 9.589-7.043 20.897-1.833 14.782 6.808 27.25 15.934 35.207 30.922zM160.201 93.236c-.635-.732-1.064-1.28-1.237-1.899-4.753-16.995-14.792-24.289-31.972-27.435-18.194-3.332-28.089 7.477-38.442 18.703-1.181 1.281-1.71 3.303-3.918 3.457-1.143-16.332 24.501-40.903 54.085-51.65.488 2.867 2.403 4.54 4.764 6.151 6.144 4.192 10.995 9.655 14.199 16.447 1.35 2.861 2.202 5.818 1.143 9.175-2.471-.96-2.491-3.227-3.16-4.95-3.279-8.435-9.158-14.57-16.668-19.325-1.57-.994-3.184-2.078-5.1-1.119-12.471 6.246-25.698 11.364-34.648 22.928-.794 1.026-1.857 1.93-1.92 4.32 10.155-6.506 20.138-12.452 32.544-12.337-.457 3.14-3.297 2.225-4.217 3.92 1.107 1.65 2.954 1.048 4.463 1.368 13.426 2.848 25.225 8.013 30.318 22.123 1.169 3.237 3.016 6.836-.234 10.123zM127.52 131.81c-17.387 1.939-34.724-4.198-38.202-14.966 21.92 17.89 42.691 14.376 63.457-1.38-1.367 7.12-10.734 12.746-25.255 16.346zM200.732 124.288c17.856 9.879 34.122 5.525 49.985-4.694-6.613 9.608-16.198 12.928-26.786 13.485-14.371.756-26.825-3.764-36.621-14.317l.813-1.812 12.609 7.338zM159.192 135.847c-1.05-1.514-2.127-2.873-.306-4.021.902-.57 1.916.024 2.644.755.956.96 1.856 2.16 1.21 3.481-.89 1.816-2.163.637-3.548-.215zM177.51 136.477c-.046-3.798 1.398-5.434 5.325-3.932-.802 2.735-2.148 4.408-5.325 3.932z"
      />
    </svg>
  );
};