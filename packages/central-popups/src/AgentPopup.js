import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
  Box,
  Typography,
  Chip,
  Slider,
  OutlinedInput,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";

/**
 * AgentPopup - Enhanced popup component for BBC agent nodes
 * Provides a more sophisticated UI for agent configuration with:
 * - Agent icon and colored header
 * - Support for number inputs with sliders
 * - Support for multiselect fields
 * - Better visual hierarchy
 */
export default function AgentPopup({ open, data, onClose }) {
  const [resolvedConfigFields, setResolvedConfigFields] = React.useState(
    data.configFields || []
  );
  const [dynamicErrors, setDynamicErrors] = React.useState({});

  const getApiBaseUrl = () => {
    if (
      typeof window !== "undefined" &&
      window.__AGENTS_API_BASE_URL__
    ) {
      return window.__AGENTS_API_BASE_URL__;
    }
    if (
      typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_WORKFLOW_API_BASE_URL
    ) {
      return import.meta.env.VITE_WORKFLOW_API_BASE_URL;
    }
    return "http://localhost:3060";
  };

  const toAbsoluteUrl = (pathOrUrl) => {
    if (!pathOrUrl) return "";
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    const base = getApiBaseUrl().replace(/\/+$/, "");
    const suffix = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
    return `${base}${suffix}`;
  };

  const normalizeOptions = (payload) => {
    if (!Array.isArray(payload)) return [];
    return payload
      .map((item) => {
        if (typeof item === "string") {
          return { value: item, label: item };
        }
        const value = item?.id ?? item?.value ?? item?.name ?? item?.label;
        if (value === undefined || value === null) return null;
        const label = item?.name ?? item?.label ?? String(value);
        return { value: String(value), label: String(label) };
      })
      .filter(Boolean);
  };

  React.useEffect(() => {
    setResolvedConfigFields(data.configFields || []);
    setDynamicErrors({});
  }, [data.configFields]);

  React.useEffect(() => {
    if (!open || !Array.isArray(data.configFields)) return;

    const dynamicFields = data.configFields.filter(
      (field) => field.dynamic && field.fetchUrl
    );
    if (!dynamicFields.length) return;

    let cancelled = false;

    const loadDynamicOptions = async () => {
      const dynamicOptionsByField = {};
      const dynamicErrorsByField = {};

      await Promise.all(
        dynamicFields.map(async (field) => {
          try {
            const response = await fetch(toAbsoluteUrl(field.fetchUrl));
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            const payload = await response.json();
            dynamicOptionsByField[field.name] = normalizeOptions(payload);
          } catch (error) {
            dynamicErrorsByField[field.name] = `Failed to load options from ${field.fetchUrl}`;
            dynamicOptionsByField[field.name] = [];
          }
        })
      );

      if (cancelled) return;

      setDynamicErrors(dynamicErrorsByField);
      setResolvedConfigFields(
        (data.configFields || []).map((field) =>
          field.dynamic
            ? {
                ...field,
                options: dynamicOptionsByField[field.name] ?? field.options ?? [],
              }
            : field
        )
      );
    };

    loadDynamicOptions();

    return () => {
      cancelled = true;
    };
  }, [open, data.configFields]);

  // Build validation schema from configFields
  const validations = {};
  resolvedConfigFields.forEach((field) => {
    if (field.type === "number") {
      validations[field.name] = Yup.number()
        .typeError(`${field.label} must be a number`)
        .min(field.min ?? 0, `Minimum is ${field.min ?? 0}`)
        .max(field.max ?? 9999, `Maximum is ${field.max ?? 9999}`);
    } else if (field.type === "multiselect") {
      validations[field.name] = Yup.array();
    } else {
      // Optional fields - no required validation by default for agents
      validations[field.name] = Yup.string();
    }
  });

  const schema = Yup.object().shape(validations);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: data.defaultValues,
  });

  const onSubmit = (formData) => {
    if (data.functions?.handleBluePrintComponent) {
      data.functions.handleBluePrintComponent(data.label, data.id, formData);
    }
    onClose();
  };

  const getOptionValue = (option) => {
    if (typeof option === "string") return option;
    return option?.value ?? option?.id ?? "";
  };

  const getOptionLabel = (option) => {
    if (typeof option === "string") {
      return option.charAt(0).toUpperCase() + option.slice(1).replace(/_/g, " ");
    }
    return option?.label ?? option?.name ?? String(getOptionValue(option));
  };

  // Render different field types
  const renderField = (field) => {
    switch (field.type) {
      case "select":
        return (
          <FormControl fullWidth error={!!errors[field.name]} size="small">
            <InputLabel>{field.label}</InputLabel>
            <Select
              label={field.label}
              defaultValue={data.defaultValues[field.name] || ""}
              {...register(field.name)}
            >
              {(field.options || []).map((option) => (
                <MenuItem key={getOptionValue(option)} value={getOptionValue(option)}>
                  {getOptionLabel(option)}
                </MenuItem>
              ))}
            </Select>
            {errors[field.name] && (
              <FormHelperText>{errors[field.name].message}</FormHelperText>
            )}
            {dynamicErrors[field.name] && (
              <FormHelperText error>{dynamicErrors[field.name]}</FormHelperText>
            )}
          </FormControl>
        );

      case "multiselect":
        return (
          <Controller
            name={field.name}
            control={control}
            defaultValue={data.defaultValues[field.name] || []}
            render={({ field: controllerField }) => (
              <FormControl fullWidth error={!!errors[field.name]} size="small">
                <InputLabel>{field.label}</InputLabel>
                <Select
                  multiple
                  label={field.label}
                  value={controllerField.value || []}
                  onChange={controllerField.onChange}
                  input={<OutlinedInput label={field.label} />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {(field.options || []).map((option) => (
                    <MenuItem key={getOptionValue(option)} value={getOptionValue(option)}>
                      {getOptionLabel(option)}
                    </MenuItem>
                  ))}
                </Select>
                {field.dynamic && (
                  <FormHelperText>
                    Options loaded dynamically from {field.fetchUrl}
                  </FormHelperText>
                )}
                {dynamicErrors[field.name] && (
                  <FormHelperText error>{dynamicErrors[field.name]}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        );

      case "number":
        return (
          <Controller
            name={field.name}
            control={control}
            defaultValue={data.defaultValues[field.name] || field.min || 0}
            render={({ field: controllerField }) => (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {field.label}: {controllerField.value}
                </Typography>
                <Slider
                  value={controllerField.value}
                  onChange={(_, value) => controllerField.onChange(value)}
                  min={field.min ?? 0}
                  max={field.max ?? 100}
                  step={field.step ?? 1}
                  marks={[
                    { value: field.min ?? 0, label: `${field.min ?? 0}` },
                    { value: field.max ?? 100, label: `${field.max ?? 100}` },
                  ]}
                  valueLabelDisplay="auto"
                  size="small"
                />
                {errors[field.name] && (
                  <FormHelperText error>{errors[field.name].message}</FormHelperText>
                )}
              </Box>
            )}
          />
        );

      case "textarea":
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            label={field.label}
            placeholder={field.placeholder}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message}
            {...register(field.name)}
          />
        );

      default:
        return (
          <TextField
            fullWidth
            size="small"
            label={field.label}
            placeholder={field.placeholder}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message}
            {...register(field.name)}
          />
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      {/* Colored Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${data.bgColor || "#8730EA"} 0%, ${data.borderColor || "#6B21A8"} 100%)`,
          color: "#fff",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <SmartToyIcon sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {data.title}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Configure agent settings
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ pt: 3 }}>
        {data.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {data.description}
          </Typography>
        )}

        <Grid container spacing={2.5}>
          {resolvedConfigFields.map((field, index) => (
            <React.Fragment key={field.name}>
              <Grid item xs={12}>
                {renderField(field)}
              </Grid>
              {/* Add divider after certain field groups */}
              {index < resolvedConfigFields.length - 1 &&
                field.name.includes("_id") &&
                !resolvedConfigFields[index + 1]?.name.includes("_id") && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                )}
            </React.Fragment>
          ))}
        </Grid>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          sx={{
            background: `linear-gradient(135deg, ${data.bgColor || "#8730EA"} 0%, ${data.borderColor || "#6B21A8"} 100%)`,
            "&:hover": {
              background: data.borderColor || "#6B21A8",
            },
          }}
        >
          Save Configuration
        </Button>
      </DialogActions>
    </Dialog>
  );
}

